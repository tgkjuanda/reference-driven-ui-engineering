#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

export function validateResponsiveConfig(config) {
  const errors = [];
  if (config?.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (typeof config?.baseUrl !== "string" || !/^https?:\/\//.test(config.baseUrl)) errors.push("baseUrl must be an absolute http(s) URL.");
  if (!Array.isArray(config?.routes) || !config.routes.length) {
    errors.push("routes must contain at least one route.");
    return errors;
  }
  for (const route of config.routes) {
    if (typeof route?.path !== "string" || !route.path.startsWith("/")) errors.push("Every route.path must start with '/'.");
    if (!Array.isArray(route?.viewports) || !route.viewports.length) {
      errors.push(`Route ${route?.path ?? "(unknown)"} requires viewports.`);
      continue;
    }
    for (const viewport of route.viewports) {
      if (!Number.isInteger(viewport?.width) || viewport.width < 1 || !Number.isInteger(viewport?.height) || viewport.height < 1) {
        errors.push(`Route ${route.path}: every viewport requires positive integer width and height.`);
      }
    }
  }
  return errors;
}

export function evaluateResponsiveSnapshot(snapshot) {
  const offenders = Array.isArray(snapshot?.offenders) ? snapshot.offenders : [];
  const overflow = snapshot?.documentScrollWidth > snapshot?.viewportWidth + 1 ||
    snapshot?.bodyScrollWidth > snapshot?.viewportWidth + 1 || offenders.length > 0;
  return {
    status: overflow ? "fail" : "pass",
    viewportWidth: snapshot?.viewportWidth ?? null,
    documentScrollWidth: snapshot?.documentScrollWidth ?? null,
    bodyScrollWidth: snapshot?.bodyScrollWidth ?? null,
    overflowCount: offenders.length,
    offenders
  };
}

async function auditResponsive(config, { cwd = process.cwd() } = {}) {
  const errors = validateResponsiveConfig(config);
  if (errors.length) throw new Error(`Invalid responsive config:\n- ${errors.join("\n- ")}`);
  const require = createRequire(path.join(path.resolve(cwd), "package.json"));
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch {
    try { ({ chromium } = require("@playwright/test")); }
    catch { throw new Error("Playwright is not installed in the target project."); }
  }
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const route of config.routes) {
      for (const viewport of route.viewports) {
        const page = await browser.newPage({ viewport });
        const url = new URL(route.path, config.baseUrl).toString();
        let result;
        try {
          const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: config.timeoutMs ?? 20000 });
          const snapshot = await page.evaluate(() => {
            const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
            const describe = element => {
              const classes = typeof element.className === "string"
                ? element.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".")
                : "";
              return `${element.tagName.toLowerCase()}${element.id ? "#" + element.id : ""}${classes ? "." + classes : ""}`;
            };
            const offenders = [];
            for (const element of document.querySelectorAll("body *")) {
              if (element.closest("[data-qa-allow-overflow], [data-qa-scroll-container]")) continue;
              const style = getComputedStyle(element);
              if (style.display === "none" || style.visibility === "hidden") continue;
              const rect = element.getBoundingClientRect();
              if (rect.width <= 0 || rect.height <= 0) continue;
              if (rect.right > viewportWidth + 1 || rect.left < -1) {
                offenders.push({
                  element: describe(element),
                  left: Math.round(rect.left * 10) / 10,
                  right: Math.round(rect.right * 10) / 10,
                  width: Math.round(rect.width * 10) / 10
                });
                if (offenders.length >= 25) break;
              }
            }
            return {
              viewportWidth,
              documentScrollWidth: document.documentElement.scrollWidth,
              bodyScrollWidth: document.body?.scrollWidth ?? document.documentElement.scrollWidth,
              offenders
            };
          });
          result = evaluateResponsiveSnapshot(snapshot);
          result.httpStatus = response?.status() ?? null;
          result.url = page.url();
          if (result.httpStatus !== null && result.httpStatus >= 400) result.status = "fail";
        } catch (error) {
          result = { status: "fail", error: error.message, viewportWidth: viewport.width };
        } finally {
          await page.close();
        }
        results.push({ route: route.path, viewport, ...result });
      }
    }
  } finally {
    await browser.close();
  }
  return {
    schemaVersion: "1.0.0",
    baseUrl: config.baseUrl,
    checkedAt: new Date().toISOString(),
    status: results.every(item => item.status === "pass") ? "pass" : "fail",
    totals: {
      checks: results.length,
      passed: results.filter(item => item.status === "pass").length,
      failed: results.filter(item => item.status !== "pass").length
    },
    results,
    limitations: [
      "This checks horizontal overflow and off-canvas elements at configured routes/viewports; it does not prove that the responsive design is visually appropriate.",
      "Elements marked data-qa-allow-overflow or inside data-qa-scroll-container are excluded from element-level overflow findings."
    ]
  };
}

async function main() {
  const args = process.argv.slice(2);
  const get = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node responsive-audit.mjs --config <responsive.json> --out <report.json>");
    return;
  }
  const configPath = get("--config"), outPath = get("--out");
  if (!configPath || !outPath) throw new Error("Required: --config and --out.");
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  const report = await auditResponsive(config);
  const destination = path.resolve(outPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 2; });
}
export { auditResponsive };
