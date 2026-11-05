#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function compareReports(baseline, actual) {
  const errors = [];
  for (const [name, report] of [["baseline", baseline], ["actual", actual]]) {
    if (report?.schemaVersion !== "1.0.0" || !Array.isArray(report.checks)) {
      errors.push(`${name} report must have schemaVersion 1.0.0 and a checks array.`);
    }
  }
  if (errors.length) return { status: "invalid", errors };

  const before = new Map(baseline.checks.map(item => [item.id, item]));
  const after = new Map(actual.checks.map(item => [item.id, item]));
  const missingChecks = [...before.keys()].filter(id => !after.has(id));
  const newChecks = [...after.keys()].filter(id => !before.has(id));
  const regressions = [];
  const resolvedFailures = [];
  const preexistingFailures = [];
  const newCheckFailures = [];

  for (const [id, previous] of before) {
    const current = after.get(id);
    if (!current) continue;
    if (previous.status === "pass" && current.status !== "pass") {
      regressions.push({ id, baseline: previous.status, actual: current.status, failures: current.failures ?? [] });
    } else if (previous.status !== "pass" && current.status === "pass") {
      resolvedFailures.push(id);
    } else if (previous.status !== "pass" && current.status !== "pass") {
      preexistingFailures.push(id);
    }
  }
  for (const id of newChecks) {
    const current = after.get(id);
    if (current.status !== "pass") newCheckFailures.push({ id, failures: current.failures ?? [] });
  }

  const failed = missingChecks.length > 0 || regressions.length > 0 || newCheckFailures.length > 0;
  return {
    status: failed ? "regressed" : preexistingFailures.length ? "no-new-regressions-with-existing-failures" : "pass",
    baselineLabel: baseline.label ?? null,
    actualLabel: actual.label ?? null,
    summary: {
      baselineChecks: before.size,
      actualChecks: after.size,
      missingChecks,
      newChecks,
      regressions,
      resolvedFailures,
      preexistingFailures,
      newCheckFailures
    },
    errors: []
  };
}

async function main() {
  const args = process.argv.slice(2);
  const get = name => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : null;
  };
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node compare-regression.mjs --baseline <baseline.json> --actual <post.json> [--out <comparison.json>]");
    return;
  }
  const baselinePath = get("--baseline");
  const actualPath = get("--actual");
  if (!baselinePath || !actualPath) throw new Error("Required: --baseline and --actual report paths.");
  const baseline = JSON.parse(await readFile(path.resolve(baselinePath), "utf8"));
  const actual = JSON.parse(await readFile(path.resolve(actualPath), "utf8"));
  const report = compareReports(baseline, actual);
  const outPath = get("--out");
  if (outPath) {
    const destination = path.resolve(outPath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify(report, null, 2));
  if (["invalid", "regressed"].includes(report.status)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 2;
  });
}
