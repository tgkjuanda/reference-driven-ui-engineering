#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

function getArg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
export async function auditAccessibility({ url, out, cwd = process.cwd(), viewport = { width: 1440, height: 900 } }) {
  const require = createRequire(path.join(path.resolve(cwd), "package.json"));
  let chromium, axe;
  try {
    ({ chromium } = require("playwright"));
    axe = require("axe-core");
  } catch {
    throw new Error("Accessibility audit requires Playwright and axe-core. Install with: npm install -D playwright axe-core && npx playwright install chromium");
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport });
    const runtimeErrors = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(async () => window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]
      }
    }));
    const report = {
      generatedAt: new Date().toISOString(),
      url,
      responseStatus: response?.status() ?? null,
      viewport,
      engine: "axe-core",
      summary: {
        violations: result.violations.length,
        passes: result.passes.length,
        incomplete: result.incomplete.length,
        inapplicable: result.inapplicable.length
      },
      violations: result.violations.map(item => ({
        id: item.id, impact: item.impact, help: item.help, helpUrl: item.helpUrl,
        nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary }))
      })),
      incomplete: result.incomplete.map(item => ({ id: item.id, impact: item.impact, help: item.help, helpUrl: item.helpUrl })),
      runtimeErrors
    };
    if (out) {
      const destination = path.resolve(cwd, out);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, JSON.stringify(report, null, 2) + "\n");
    }
    return report;
  } finally {
    await browser.close();
  }
}
async function main() {
  const url = getArg("--url");
  if (!url) {
    console.error("Usage: node accessibility-audit.mjs --url http://localhost:3000 [--out artifacts/ui-reference/accessibility.json]");
    process.exitCode = 2;
    return;
  }
  try {
    const report = await auditAccessibility({ url, out: getArg("--out") });
    console.log(JSON.stringify(report, null, 2));
    if (report.summary.violations > 0) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
