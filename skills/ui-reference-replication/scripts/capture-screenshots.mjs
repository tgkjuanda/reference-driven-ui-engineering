#!/usr/bin/env node
import { mkdir, writeFile, realpath } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

function getArg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
function parseViewports(value) {
  return value.split(",").map(item => {
    const match = item.trim().match(/^(\d+)x(\d+)$/);
    if (!match) throw new Error(`Invalid viewport "${item}". Use WIDTHxHEIGHT.`);
    return { width: Number(match[1]), height: Number(match[2]) };
  });
}
function slug(value) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
}
export function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(".." + path.sep) && relative !== ".." && !path.isAbsolute(relative));
}
async function resolveWithinProject(root, requested, label = "path") {
  const base = await realpath(root);
  const candidate = path.resolve(base, requested);
  if (!isInside(base, candidate)) throw new Error(label + " must stay inside the project directory.");
  let probe = candidate;
  while (true) {
    try {
      const actual = await realpath(probe);
      if (!isInside(base, actual)) throw new Error(label + " resolves through a symlink outside the project directory.");
      break;
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      const parent = path.dirname(probe);
      if (parent === probe) throw error;
      probe = parent;
    }
  }
  return candidate;
}
export async function captureScreenshots(options) {
  const cwd = await realpath(path.resolve(options.cwd ?? process.cwd()));
  const outputDir = await resolveWithinProject(cwd, options.out ?? "artifacts/ui-reference/screenshots", "Screenshot output");
  const require = createRequire(path.join(cwd, "package.json"));
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch {
    try { ({ chromium } = require("@playwright/test")); }
    catch { throw new Error("Playwright is not installed in the project. Install it with: npm install -D playwright && npx playwright install chromium"); }
  }
  await mkdir(outputDir, { recursive: true });
  const routes = options.routes ?? ["/"];
  const viewports = options.viewports ?? [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }];
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const route of routes) {
      const url = new URL(route, options.url).toString();
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: options.deviceScaleFactor ?? 1 });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        let responseStatus = null;
        try {
          const response = await page.goto(url, { waitUntil: "networkidle", timeout: options.timeout ?? 30000 });
          responseStatus = response?.status() ?? null;
        } catch (error) {
          if (!page.url()) throw error;
          errors.push(`Navigation wait: ${error.message}`);
        }
        await page.evaluate(async () => {
          if (document.fonts?.ready) await document.fonts.ready;
        });
        await page.waitForTimeout(options.settleMs ?? 300);
        const filename = `${slug(route)}-${viewport.width}x${viewport.height}.png`;
        const file = path.join(outputDir, filename);
        await page.screenshot({ path: file, fullPage: Boolean(options.fullPage), animations: "disabled" });
        results.push({ url, viewport, responseStatus, screenshot: path.relative(cwd, file), pageErrors: errors });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  const manifest = { generatedAt: new Date().toISOString(), baseUrl: options.url, screenshots: results };
  await writeFile(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

async function main() {
  const url = getArg("--url");
  if (!url) {
    console.error("Usage: node capture-screenshots.mjs --url http://localhost:3000 [--routes /,/admin] [--out artifacts/ui-reference] [--viewports 390x844,768x1024,1440x900] [--full-page]");
    process.exitCode = 2;
    return;
  }
  try {
    const manifest = await captureScreenshots({
      url,
      routes: (getArg("--routes", "/")).split(",").map(x => x.trim()).filter(Boolean),
      out: getArg("--out", "artifacts/ui-reference/screenshots"),
      viewports: parseViewports(getArg("--viewports", "390x844,768x1024,1440x900")),
      fullPage: process.argv.includes("--full-page"),
      timeout: Number(getArg("--timeout", "30000")),
      settleMs: Number(getArg("--settle-ms", "300"))
    });
    console.log(JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
