#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

export const DEFAULT_BUDGETS = {
  fcpMs: 1800,
  lcpMs: 2500,
  cls: 0.1,
  domNodes: 1500,
  resourceCount: 80,
  transferBytes: 2000000
};

export function validatePerformanceConfig(config) {
  const errors = [];
  if (config?.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (typeof config?.baseUrl !== "string" || !/^https?:\/\//.test(config.baseUrl)) errors.push("baseUrl must be an absolute http(s) URL.");
  if (!Array.isArray(config?.routes) || !config.routes.length) errors.push("routes must contain at least one route.");
  for (const route of config?.routes ?? []) {
    if (typeof route?.path !== "string" || !route.path.startsWith("/")) errors.push("Every route.path must start with '/'.");
    for (const [key, value] of Object.entries({ ...DEFAULT_BUDGETS, ...(route?.budgets ?? {}) })) {
      if (!Number.isFinite(value) || value < 0) errors.push(`Route ${route.path}: budget ${key} must be a non-negative number.`);
    }
  }
  return errors;
}

export function evaluatePerformanceMetrics(metrics, budgets = DEFAULT_BUDGETS) {
  const checks = Object.entries(budgets).map(([name, limit]) => {
    const value = metrics?.[name];
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return { metric: name, status: "not-measurable", value: null, limit };
    }
    return { metric: name, status: value <= limit ? "pass" : "fail", value, limit };
  });
  const status = checks.some(item => item.status === "fail") ? "fail" :
    checks.some(item => item.status === "not-measurable") ? "partial" : "pass";
  return { status, checks };
}

async function auditPerformance(config, { cwd = process.cwd() } = {}) {
  const errors = validatePerformanceConfig(config);
  if (errors.length) throw new Error(`Invalid performance config:\n- ${errors.join("\n- ")}`);
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
      const page = await browser.newPage({ viewport: route.viewport ?? { width: 1365, height: 768 } });
      const url = new URL(route.path, config.baseUrl).toString();
      try {
        await page.addInitScript(() => {
          window.__uiReferencePerf = { lcpMs: null, cls: 0 };
          try {
            new PerformanceObserver(list => {
              const entries = list.getEntries();
              const last = entries[entries.length - 1];
              if (last) window.__uiReferencePerf.lcpMs = last.startTime;
            }).observe({ type: "largest-contentful-paint", buffered: true });
          } catch {}
          try {
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) window.__uiReferencePerf.cls += entry.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
          } catch {}
        });
        const response = await page.goto(url, { waitUntil: "load", timeout: config.timeoutMs ?? 30000 });
        await page.waitForTimeout(config.settleMs ?? 1000);
        const measured = await page.evaluate(() => {
          const nav = performance.getEntriesByType("navigation")[0];
          const resources = performance.getEntriesByType("resource");
          const fcp = performance.getEntriesByName("first-contentful-paint")[0];
          return {
            fcpMs: fcp?.startTime ?? null,
            lcpMs: window.__uiReferencePerf?.lcpMs ?? null,
            cls: window.__uiReferencePerf?.cls ?? null,
            domNodes: document.getElementsByTagName("*").length,
            resourceCount: resources.length,
            transferBytes: resources.reduce((sum, item) => sum + (item.transferSize || 0), nav?.transferSize || 0),
            domContentLoadedMs: nav?.domContentLoadedEventEnd ?? null,
            loadMs: nav?.loadEventEnd ?? null
          };
        });
        const evaluated = evaluatePerformanceMetrics(measured, { ...DEFAULT_BUDGETS, ...(route.budgets ?? {}) });
        results.push({
          route: route.path,
          url: page.url(),
          httpStatus: response?.status() ?? null,
          status: response && response.status() >= 400 ? "fail" : evaluated.status,
          metrics: measured,
          budgetChecks: evaluated.checks
        });
      } catch (error) {
        results.push({ route: route.path, status: "fail", error: error.message });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  return {
    schemaVersion: "1.0.0",
    baseUrl: config.baseUrl,
    checkedAt: new Date().toISOString(),
    status: results.some(item => item.status === "fail") ? "fail" :
      results.some(item => item.status === "partial") ? "partial" : "pass",
    results,
    limitations: [
      "Measurements are browser lab diagnostics and vary with machine, network, cache, browser, and test data.",
      "This script measures FCP, LCP, CLS, DOM nodes, resource count, and transfer size; it does not measure field Core Web Vitals or INP.",
      "Budgets are project-specific guardrails, not universal performance guarantees."
    ]
  };
}

async function main() {
  const args = process.argv.slice(2);
  const get = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node performance-audit.mjs --config <performance.json> --out <report.json>");
    return;
  }
  const configPath = get("--config"), outPath = get("--out");
  if (!configPath || !outPath) throw new Error("Required: --config and --out.");
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  const report = await auditPerformance(config);
  const destination = path.resolve(outPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 2; });
}
export { auditPerformance };
