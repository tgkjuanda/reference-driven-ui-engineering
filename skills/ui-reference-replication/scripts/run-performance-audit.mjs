#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const METRICS = ["timeToFirstByteMs", "firstContentfulPaintMs", "largestContentfulPaintMs", "cumulativeLayoutShift", "observedBlockingTimeMs", "transferBytes", "javascriptBytes", "cssBytes"];
export function evaluatePerformanceMetrics(metrics, budgets) {
  const unknown = Object.keys(budgets || {}).filter(name => !METRICS.includes(name));
  const checks = METRICS.filter(name => Object.hasOwn(budgets || {}, name)).map(name => {
    const actual = metrics ? metrics[name] : null, limit = budgets[name];
    if (!Number.isFinite(limit) || limit < 0) return { metric: name, status: "fail", error: "Budget must be a non-negative finite number." };
    if (!Number.isFinite(actual)) return { metric: name, status: "not-tested", budget: limit, actual: null, reason: "Metric was unavailable in this browser run." };
    return { metric: name, status: actual > limit ? "fail" : "pass", budget: limit, actual, unit: name.endsWith("Bytes") ? "bytes" : name === "cumulativeLayoutShift" ? "score" : "ms" };
  });
  const errors = unknown.map(name => "Unknown performance budget metric: " + name);
  errors.push(...checks.filter(item => item.error).map(item => item.metric + ": " + item.error));
  const failed = checks.filter(item => item.status === "fail"), untested = checks.filter(item => item.status === "not-tested");
  return {
    status: errors.length || failed.length ? "fail" : untested.length ? "partial" : checks.length ? "pass" : "not-tested",
    checks, errors,
    summary: { passed: checks.filter(item => item.status === "pass").length, failed: failed.length, notTested: untested.length },
    limitations: ["Browser lab observations are not field Core Web Vitals.", "Observed blocking time is an approximation from Long Task entries, not a complete Lighthouse TBT measurement.", "Transfer sizes may be unavailable for cross-origin resources without Timing-Allow-Origin."]
  };
}
function getArg(args, name, fallback) { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; }
async function runPerformanceAudit(options) {
  const require = createRequire(path.join(options.cwd, "package.json"));
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch { throw new Error("Performance audit requires Playwright in the target project. Install with: npm install -D playwright && npx playwright install chromium"); }
  const browser = await chromium.launch({ headless: true }), results = [];
  try {
    for (const route of options.routes) {
      const page = await browser.newPage(), pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.addInitScript(() => {
        window.__uiReferencePerf = { lcp: null, cls: 0, blocking: 0 };
        try { new PerformanceObserver(list => { const entries = list.getEntries(); const last = entries[entries.length - 1]; if (last) window.__uiReferencePerf.lcp = last.startTime; }).observe({ type: "largest-contentful-paint", buffered: true }); } catch {}
        try { new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__uiReferencePerf.cls += entry.value; }).observe({ type: "layout-shift", buffered: true }); } catch {}
        try { new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__uiReferencePerf.blocking += Math.max(0, entry.duration - 50); }).observe({ type: "longtask", buffered: true }); } catch {}
      });
      let navigationError = null, metrics = null;
      try {
        const base = options.baseUrl.endsWith("/") ? options.baseUrl : options.baseUrl + "/";
        await page.goto(new URL(route, base).toString(), { waitUntil: "load", timeout: options.timeoutMs });
        if (options.settleMs > 0) await page.waitForTimeout(options.settleMs);
        metrics = await page.evaluate(() => {
          const paints = performance.getEntriesByType("paint"), fcp = paints.find(entry => entry.name === "first-contentful-paint");
          const nav = performance.getEntriesByType("navigation")[0], resources = performance.getEntriesByType("resource");
          const sum = entries => entries.reduce((total, entry) => total + (entry.transferSize || 0), 0);
          const js = resources.filter(entry => { const name = entry.name.split("?")[0].split("#")[0].toLowerCase(); return name.endsWith(".js") || name.endsWith(".mjs"); });
          const css = resources.filter(entry => entry.name.split("?")[0].split("#")[0].toLowerCase().endsWith(".css"));
          const measured = entries => entries.length === 0 ? 0 : entries.some(entry => entry.transferSize > 0) ? sum(entries) : null;
          return {
            timeToFirstByteMs: nav ? nav.responseStart - nav.requestStart : null,
            firstContentfulPaintMs: fcp ? fcp.startTime : null,
            largestContentfulPaintMs: window.__uiReferencePerf.lcp,
            cumulativeLayoutShift: window.__uiReferencePerf.cls,
            observedBlockingTimeMs: window.__uiReferencePerf.blocking,
            transferBytes: measured(resources), javascriptBytes: measured(js), cssBytes: measured(css),
            resourceCount: resources.length, domNodeCount: document.getElementsByTagName("*").length
          };
        });
      } catch (error) { navigationError = error.message; }
      const evaluated = navigationError ? { status: "fail", checks: [], errors: ["Navigation failed: " + navigationError] } : evaluatePerformanceMetrics(metrics, options.budgets);
      const status = pageErrors.length || evaluated.status === "fail" ? "fail" : evaluated.status;
      results.push({ route, status, metrics, checks: evaluated.checks, errors: [...(evaluated.errors || []), ...pageErrors], pageErrors });
      await page.close();
    }
  } finally { await browser.close(); }
  const statuses = results.map(item => item.status);
  return {
    schemaVersion: "1.0.0", generatedAt: new Date().toISOString(), baseUrl: options.baseUrl, budgets: options.budgets,
    status: statuses.includes("fail") ? "fail" : statuses.includes("partial") || statuses.includes("not-tested") ? "partial" : "pass",
    results,
    limitations: ["Browser lab measurements are not field Core Web Vitals.", "Largest Contentful Paint is sampled after the configured settle window.", "Observed blocking time is a Long Task approximation, not Lighthouse Total Blocking Time.", "Cross-origin transfer sizes can be unavailable without Timing-Allow-Origin."]
  };
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node run-performance-audit.mjs --url <base-url> --budget <budget.json> [--routes /,/dashboard] [--out report.json]"); return; }
  const baseUrl = getArg(args, "--url"), budgetPath = getArg(args, "--budget");
  if (!baseUrl || !budgetPath) throw new Error("Required: --url <base-url> and --budget <budget.json>.");
  if (!["http:", "https:"].includes(new URL(baseUrl).protocol)) throw new Error("Base URL must use HTTP or HTTPS.");
  const budgetFile = JSON.parse(await readFile(path.resolve(budgetPath), "utf8"));
  if (budgetFile.schemaVersion !== "1.0.0" || !budgetFile.budgets || typeof budgetFile.budgets !== "object") throw new Error("Budget file must contain schemaVersion 1.0.0 and a budgets object.");
  const routes = String(getArg(args, "--routes", "/")).split(",").map(item => item.trim()).filter(Boolean);
  if (!routes.length || routes.some(route => !route.startsWith("/") || route.startsWith("//"))) throw new Error("Routes must be relative paths beginning with one slash.");
  const options = { cwd: process.cwd(), baseUrl, routes, budgets: budgetFile.budgets, timeoutMs: Number(getArg(args, "--timeout-ms", "30000")), settleMs: Number(getArg(args, "--settle-ms", "1000")) };
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs < 1) throw new Error("A positive --timeout-ms is required.");
  const report = await runPerformanceAudit(options), out = getArg(args, "--out");
  if (out) { const destination = path.resolve(out); await mkdir(path.dirname(destination), { recursive: true }); await writeFile(destination, JSON.stringify(report, null, 2) + String.fromCharCode(10)); }
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 2; });
