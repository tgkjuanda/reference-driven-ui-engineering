#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ACTIONS = {
  click: ["selector"],
  fill: ["selector", "value"],
  "select-option": ["selector", "value"],
  check: ["selector"],
  uncheck: ["selector"],
  press: ["selector", "key"],
  "expect-visible": ["selector"],
  "expect-hidden": ["selector"],
  "expect-enabled": ["selector"],
  "expect-disabled": ["selector"],
  "expect-text": ["selector", "text"],
  "expect-url-includes": ["value"]
};

export function validateConfig(config) {
  const errors = [];
  if (!config || config.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (typeof config?.baseUrl !== "string" || !/^https?:\/\//.test(config.baseUrl)) {
    errors.push("baseUrl must be an absolute http(s) URL.");
  }
  if (!Array.isArray(config?.checks) || config.checks.length === 0) {
    errors.push("checks must contain at least one regression check.");
    return errors;
  }
  const ids = new Set();
  for (const check of config.checks) {
    if (!check || typeof check.id !== "string" || !check.id.trim()) {
      errors.push("Each check requires a non-empty id.");
      continue;
    }
    if (ids.has(check.id)) errors.push(`Duplicate check id: ${check.id}`);
    ids.add(check.id);
    if (typeof check.route !== "string" || !check.route.startsWith("/")) {
      errors.push(`Check ${check.id}: route must start with "/".`);
    }
    const expectedStatus = check.expectedStatus ?? 200;
    if (!Number.isInteger(expectedStatus) || expectedStatus < 100 || expectedStatus > 599) {
      errors.push(`Check ${check.id}: expectedStatus must be an HTTP status integer.`);
    }
    if (check.steps !== undefined && !Array.isArray(check.steps)) {
      errors.push(`Check ${check.id}: steps must be an array.`);
      continue;
    }
    for (const [index, step] of (check.steps ?? []).entries()) {
      if (!step || !ACTIONS[step.action]) {
        errors.push(`Check ${check.id}, step ${index + 1}: unsupported action.`);
        continue;
      }
      for (const field of ACTIONS[step.action]) {
        if (typeof step[field] !== "string" || !step[field].trim()) {
          errors.push(`Check ${check.id}, step ${index + 1}: ${step.action} requires ${field}.`);
        }
      }
      if (step.timeoutMs !== undefined && (!Number.isInteger(step.timeoutMs) || step.timeoutMs < 1)) {
        errors.push(`Check ${check.id}, step ${index + 1}: timeoutMs must be a positive integer.`);
      }
    }
  }
  return errors;
}

async function runStep(page, step, timeoutMs) {
  const locator = step.selector ? page.locator(step.selector) : null;
  switch (step.action) {
    case "click": await locator.click({ timeout: timeoutMs }); break;
    case "fill": await locator.fill(step.value, { timeout: timeoutMs }); break;
    case "select-option": await locator.selectOption(step.value, { timeout: timeoutMs }); break;
    case "check": await locator.check({ timeout: timeoutMs }); break;
    case "uncheck": await locator.uncheck({ timeout: timeoutMs }); break;
    case "press": await locator.press(step.key, { timeout: timeoutMs }); break;
    case "expect-visible": await locator.waitFor({ state: "visible", timeout: timeoutMs }); break;
    case "expect-hidden": await locator.waitFor({ state: "hidden", timeout: timeoutMs }); break;
    case "expect-enabled":
      if (!(await locator.isEnabled())) throw new Error(`Expected enabled: ${step.selector}`);
      break;
    case "expect-disabled":
      if (await locator.isEnabled()) throw new Error(`Expected disabled: ${step.selector}`);
      break;
    case "expect-text": {
      const actual = await locator.innerText({ timeout: timeoutMs });
      if (!actual.includes(step.text)) throw new Error(`Expected text "${step.text}" in ${step.selector}; received "${actual.slice(0, 240)}"`);
      break;
    }
    case "expect-url-includes":
      if (!page.url().includes(step.value)) throw new Error(`Expected URL to include "${step.value}"; received "${page.url()}"`);
      break;
    default: throw new Error(`Unsupported action: ${step.action}`);
  }
}

export async function runRegression(config, { cwd = process.cwd(), label = "run", baseUrl } = {}) {
  const errors = validateConfig(config);
  if (errors.length) throw new Error(`Invalid regression config:\n- ${errors.join("\n- ")}`);
  const require = createRequire(path.join(path.resolve(cwd), "package.json"));
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch {
    try { ({ chromium } = require("@playwright/test")); }
    catch { throw new Error("Playwright is not installed in the target project. Install/configure it before running functional regression."); }
  }

  const targetUrl = baseUrl ?? config.baseUrl;
  const timeoutMs = config.timeoutMs ?? 10000;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const startedAt = new Date().toISOString();
  try {
    for (const check of config.checks) {
      const started = Date.now();
      const page = await browser.newPage();
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      const failures = [];
      let responseStatus = null;
      let navigatedUrl = null;
      let assertionsRun = 0;
      try {
        const url = new URL(check.route, targetUrl).toString();
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: check.timeoutMs ?? timeoutMs });
        responseStatus = response?.status() ?? null;
        navigatedUrl = page.url();
        assertionsRun += 1;
        if (responseStatus !== (check.expectedStatus ?? 200)) {
          failures.push(`Expected HTTP ${check.expectedStatus ?? 200}; received ${responseStatus ?? "no response"}.`);
        }
        for (const step of check.steps ?? []) {
          assertionsRun += step.action.startsWith("expect-") ? 1 : 0;
          try {
            await runStep(page, step, step.timeoutMs ?? check.timeoutMs ?? timeoutMs);
          } catch (error) {
            failures.push(`Step ${step.action}: ${error.message}`);
          }
        }
        if (check.failOnPageError !== false && pageErrors.length) {
          failures.push(...pageErrors.map(message => `Page error: ${message}`));
        }
      } catch (error) {
        failures.push(`Navigation/runtime: ${error.message}`);
      } finally {
        await page.close();
      }
      results.push({
        id: check.id,
        route: check.route,
        status: failures.length ? "fail" : "pass",
        responseStatus,
        navigatedUrl,
        assertionsRun,
        failures,
        pageErrors,
        durationMs: Date.now() - started
      });
    }
  } finally {
    await browser.close();
  }

  return {
    schemaVersion: "1.0.0",
    label,
    baseUrl: targetUrl,
    startedAt,
    completedAt: new Date().toISOString(),
    status: results.every(item => item.status === "pass") ? "pass" : "fail",
    totals: {
      checks: results.length,
      passed: results.filter(item => item.status === "pass").length,
      failed: results.filter(item => item.status === "fail").length
    },
    checks: results,
    limitations: [
      "Only checks explicitly declared in the supplied config were executed.",
      "This runner does not infer or prove undocumented business workflows."
    ]
  };
}

function getArg(args, name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

async function main() {
  const args = process.argv.slice(2);
  const configPath = getArg(args, "--config");
  const outputPath = getArg(args, "--out");
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node run-functional-regression.mjs --config <file.json> --out <report.json> [--label baseline|post-redesign] [--base-url <url>]");
    return;
  }
  if (!configPath || !outputPath) {
    throw new Error("Required: --config <file.json> and --out <report.json>. Use --help for usage.");
  }
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  const report = await runRegression(config, {
    label: getArg(args, "--label", "run"),
    baseUrl: getArg(args, "--base-url")
  });
  const destination = path.resolve(outputPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 2;
  });
}
