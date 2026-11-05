#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
export function parseViewports(value) {
  const items = String(value).split(",").map(item => item.trim()).filter(Boolean);
  if (!items.length) throw new Error("At least one viewport is required.");
  return items.map(item => {
    const parts = item.split("x");
    if (parts.length !== 2 || !/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[1])) throw new Error("Invalid viewport " + item + ". Use WIDTHxHEIGHT.");
    const width = Number(parts[0]), height = Number(parts[1]);
    if (width < 240 || width > 10000 || height < 320 || height > 10000) throw new Error("Viewport dimensions are outside the supported range: " + item);
    return { width, height };
  });
}
export function evaluateResponsiveMetrics(metrics, tolerance = 1) {
  const width = Number(metrics && metrics.viewportWidth), scrollWidth = Number(metrics && metrics.scrollWidth);
  if (!Number.isFinite(width) || !Number.isFinite(scrollWidth) || width <= 0 || scrollWidth <= 0) return { status: "fail", errors: ["Viewport and document widths must be positive finite numbers."] };
  const overflowPx = Math.max(0, scrollWidth - width), errors = [];
  if (overflowPx > tolerance) errors.push("Document has horizontal overflow of " + overflowPx + "px.");
  if (width <= 767 && metrics.viewportMeta !== true) errors.push("Mobile viewport meta tag is missing.");
  if (Array.isArray(metrics.pageErrors) && metrics.pageErrors.length) errors.push("Browser page errors were recorded: " + metrics.pageErrors.length + ".");
  return { status: errors.length ? "fail" : "pass", viewportWidth: width, scrollWidth, overflowPx, viewportMeta: metrics.viewportMeta === true, pageErrors: metrics.pageErrors || [], errors };
}
function getArg(args, name, fallback) { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; }
async function runResponsiveAudit(options) {
  const require = createRequire(path.join(options.cwd, "package.json"));
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch { throw new Error("Responsive audit requires Playwright in the target project. Install with: npm install -D playwright && npx playwright install chromium"); }
  const browser = await chromium.launch({ headless: true }), results = [];
  try {
    const page = await browser.newPage(), base = options.baseUrl.endsWith("/") ? options.baseUrl : options.baseUrl + "/";
    for (const route of options.routes) for (const viewport of options.viewports) {
      const pageErrors = [];
      page.removeAllListeners("pageerror");
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.setViewportSize(viewport);
      let navigationError = null, metrics = null;
      try {
        await page.goto(new URL(route, base).toString(), { waitUntil: "domcontentloaded", timeout: options.timeoutMs });
        await page.evaluate(() => document.fonts ? document.fonts.ready : true);
        if (options.settleMs > 0) await page.waitForTimeout(options.settleMs);
        metrics = await page.evaluate(() => ({
          viewportWidth: window.innerWidth,
          scrollWidth: Math.max(document.documentElement ? document.documentElement.scrollWidth : 0, document.body ? document.body.scrollWidth : 0),
          viewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
          documentHeight: Math.max(document.documentElement ? document.documentElement.scrollHeight : 0, document.body ? document.body.scrollHeight : 0)
        }));
      } catch (error) { navigationError = error.message; }
      const evaluated = navigationError ? { status: "fail", errors: ["Navigation failed: " + navigationError] } : evaluateResponsiveMetrics({ ...metrics, pageErrors });
      results.push({ route, viewport, status: evaluated.status, metrics, pageErrors, errors: evaluated.errors });
    }
  } finally { await browser.close(); }
  return {
    schemaVersion: "1.0.0", generatedAt: new Date().toISOString(), baseUrl: options.baseUrl, viewports: options.viewports,
    summary: { total: results.length, passed: results.filter(item => item.status === "pass").length, failed: results.filter(item => item.status === "fail").length },
    status: results.every(item => item.status === "pass") ? "pass" : "fail", results,
    limitation: "Checks document-level horizontal overflow, mobile viewport metadata, navigation, and browser page errors. It does not prove visual quality or test every interaction."
  };
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node run-responsive-audit.mjs --url <base-url> [--routes /,/dashboard] [--viewports 390x844,768x1024,1440x900] [--out report.json]"); return; }
  const baseUrl = getArg(args, "--url");
  if (!baseUrl) throw new Error("Required: --url <base-url>.");
  if (!["http:", "https:"].includes(new URL(baseUrl).protocol)) throw new Error("Base URL must use HTTP or HTTPS.");
  const routes = String(getArg(args, "--routes", "/")).split(",").map(item => item.trim()).filter(Boolean);
  if (!routes.length || routes.some(route => !route.startsWith("/") || route.startsWith("//"))) throw new Error("Routes must be relative paths beginning with one slash.");
  const options = { cwd: process.cwd(), baseUrl, routes, viewports: parseViewports(getArg(args, "--viewports", "390x844,768x1024,1440x900")), timeoutMs: Number(getArg(args, "--timeout-ms", "30000")), settleMs: Number(getArg(args, "--settle-ms", "250")) };
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs < 1) throw new Error("A positive --timeout-ms is required.");
  const report = await runResponsiveAudit(options), out = getArg(args, "--out");
  if (out) { const destination = path.resolve(out); await mkdir(path.dirname(destination), { recursive: true }); await writeFile(destination, JSON.stringify(report, null, 2) + String.fromCharCode(10)); }
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 2; });
