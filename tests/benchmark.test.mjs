import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import {
  validateBenchmark,
  compareBenchmarks
} from "../skills/ui-reference-replication/scripts/benchmark.mjs";

const scriptPath = fileURLToPath(new URL("../skills/ui-reference-replication/scripts/benchmark.mjs", import.meta.url));

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "bm-"));
  await mkdir(path.join(root, "evidence"));
  await writeFile(path.join(root, "evidence/run.json"), "{}");
  const make = (version, numbers, visual = "pass") => ({
    schemaVersion: "1.0.0",
    benchmarkId: "b",
    scenario: {
      id: "same",
      fixtureId: "f",
      workMode: "new-build",
      fidelity: "reference-faithful"
    },
    runs: numbers.map((number, index) => ({
      runId: version + index,
      agent: { id: "a", model: "m", runtime: "r", skillVersion: version },
      measuredAt: "2026-11-05T10:00:00Z",
      quality: { visualReview: visual, functionalRegression: "pass", criticalDefects: 0 },
      usage: {
        source: "provider-runtime",
        inputTokens: number,
        outputTokens: 0,
        actualCostUsd: number / 100000,
        costSource: "provider-runtime"
      },
      evidence: ["evidence/run.json"]
    }))
  });
  return { root, baseline: make("3.1", [1000, 1100, 900]), candidate: make("3.2", [800, 850, 750]) };
}

async function writeReports(root, baseline, candidate) {
  await writeFile(path.join(root, "baseline.json"), JSON.stringify(baseline));
  await writeFile(path.join(root, "candidate.json"), JSON.stringify(candidate));
}

function runCompare(root, extra = []) {
  return execFileSync(process.execPath, [
    scriptPath,
    "compare",
    "--root", root,
    "--baseline", "baseline.json",
    "--candidate", "candidate.json",
    "--minimum-runs", "3",
    ...extra
  ], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

test("benchmark evidence and measured usage validates", async () => {
  const data = await fixture();
  try {
    assert.equal((await validateBenchmark(data.baseline, data.root)).status, "pass");
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("empty template is not-tested", async () => {
  const result = await validateBenchmark({
    schemaVersion: "1.0.0",
    benchmarkId: "b",
    scenario: { id: "x", fixtureId: "f", workMode: "new-build", fidelity: "reference-faithful" },
    runs: []
  });
  assert.equal(result.status, "not-tested");
});

test("missing evidence fails", async () => {
  const data = await fixture();
  try {
    data.baseline.runs[0].evidence = ["missing"];
    assert.equal((await validateBenchmark(data.baseline, data.root)).status, "fail");
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("median token/cost savings require quality pass and at least three runs", () => {
  const scenario = { id: "same", fixtureId: "f", workMode: "new-build", fidelity: "reference-faithful" };
  const make = (numbers, visualReview) => ({
    scenario,
    runs: numbers.map(number => ({
      agent: { id: "a", model: "m", runtime: "r" },
      quality: { visualReview, functionalRegression: "pass", criticalDefects: 0 },
      usage: {
        source: "provider-runtime",
        inputTokens: number,
        outputTokens: 0,
        actualCostUsd: number / 100000,
        costSource: "provider-runtime"
      }
    }))
  });
  const result = compareBenchmarks(make([1000, 1100, 900], "pass"), make([800, 850, 750], "pass"));
  assert.equal(result.status, "comparable");
  assert.equal(result.tokens.savingsPercent, 20);
});

test("quality regression withholds savings", () => {
  const scenario = { id: "same", fixtureId: "f" };
  const make = visualReview => ({
    scenario,
    runs: [1, 2, 3].map(() => ({
      agent: { id: "a", model: "m", runtime: "r" },
      quality: { visualReview, functionalRegression: "pass", criticalDefects: 0 },
      usage: { source: "provider-runtime", inputTokens: 100, outputTokens: 0 }
    }))
  });
  const result = compareBenchmarks(make("pass"), make("fail"));
  assert.equal(result.status, "quality-regression");
  assert.equal(result.tokenSavingsPercent, null);
});

test("estimated usage and insufficient runs cannot produce savings", () => {
  const scenario = { id: "same", fixtureId: "f" };
  const one = {
    scenario,
    runs: [{
      agent: { id: "a", model: "m", runtime: "r" },
      quality: { visualReview: "pass", functionalRegression: "pass", criticalDefects: 0 },
      usage: { source: "estimated", inputTokens: 10, outputTokens: 2 }
    }]
  };
  assert.equal(compareBenchmarks(one, one).status, "insufficient-samples");
});

test("compare CLI validates both reports before producing savings", async () => {
  const data = await fixture();
  try {
    await writeReports(data.root, data.baseline, data.candidate);
    const output = JSON.parse(runCompare(data.root));
    assert.equal(output.status, "comparable");
    assert.equal(output.validation.baseline.status, "pass");
    assert.equal(output.validation.candidate.status, "pass");
    assert.equal(output.tokens.savingsPercent, 20);
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("compare CLI refuses a malformed measured token count", async () => {
  const data = await fixture();
  try {
    data.candidate.runs[0].usage.inputTokens = "800";
    await writeReports(data.root, data.baseline, data.candidate);
    let error;
    try {
      runCompare(data.root);
    } catch (caught) {
      error = caught;
    }
    assert.ok(error, "CLI should exit non-zero for invalid benchmark inputs");
    const output = JSON.parse(error.stdout.toString());
    assert.equal(output.status, "validation-failed");
    assert.equal(output.validation.candidate.status, "fail");
    assert.equal(output.comparison, null);
    assert.equal(Object.hasOwn(output, "tokens"), false);
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("compare CLI refuses a passing report without evidence", async () => {
  const data = await fixture();
  try {
    data.candidate.runs[0].evidence = [];
    await writeReports(data.root, data.baseline, data.candidate);
    let error;
    try {
      runCompare(data.root);
    } catch (caught) {
      error = caught;
    }
    assert.ok(error, "CLI should exit non-zero when evidence is missing");
    const output = JSON.parse(error.stdout.toString());
    assert.equal(output.status, "validation-failed");
    assert.equal(output.validation.candidate.status, "fail");
    assert.equal(output.comparison, null);
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("compare helper rejects malformed numeric usage without throwing", () => {
  const scenario = { id: "same", fixtureId: "f", workMode: "new-build", fidelity: "reference-faithful" };
  const make = tokenCount => ({
    scenario,
    runs: [1, 2, 3].map(index => ({
      agent: { id: "a", model: "m", runtime: "r" },
      quality: { visualReview: "pass", functionalRegression: "pass", criticalDefects: 0 },
      usage: { source: "provider-runtime", inputTokens: tokenCount, outputTokens: 0 }
    }))
  });
  assert.equal(compareBenchmarks(make("900"), make(800)).status, "invalid-usage");
  assert.equal(compareBenchmarks({ runs: null }, { runs: [] }).status, "invalid-report");
});
