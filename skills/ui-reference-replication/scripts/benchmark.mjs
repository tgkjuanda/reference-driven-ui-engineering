#!/usr/bin/env node
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SOURCES = ["provider-runtime", "host-runtime", "estimated", "unavailable"];
const STATUSES = ["pass", "partial", "fail", "not-tested"];

async function hasFile(root, rel) {
  if (typeof rel !== "string" || !rel.trim() || path.isAbsolute(rel)) return false;
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) return false;
  try {
    const resolved = await realpath(p);
    return (resolved === root || resolved.startsWith(root + path.sep)) && (await stat(resolved)).isFile();
  } catch {
    return false;
  }
}

async function resolveFileWithinRoot(root, relativePath, label) {
  if (typeof relativePath !== "string" || !relativePath.trim() || path.isAbsolute(relativePath)) {
    throw new Error(label + " must be a non-empty relative path.");
  }
  const candidate = path.resolve(root, relativePath);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) {
    throw new Error(label + " escapes --root.");
  }
  const resolved = await realpath(candidate);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error(label + " resolves outside --root.");
  }
  return resolved;
}

async function readJsonWithinRoot(root, relativePath, label) {
  const file = await resolveFileWithinRoot(root, relativePath, label);
  return JSON.parse(await readFile(file, "utf8"));
}

export async function validateBenchmark(d, root = process.cwd()) {
  const errors = [], warnings = [], runs = Array.isArray(d && d.runs) ? d.runs : [];
  const ids = new Set(), base = await realpath(root);
  if (!d || d.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (!d || typeof d.benchmarkId !== "string" || !d.benchmarkId.trim()) errors.push("benchmarkId is required.");

  const scenario = d && d.scenario;
  if (!scenario || typeof scenario.id !== "string" || !scenario.id.trim() ||
      typeof scenario.fixtureId !== "string" || !scenario.fixtureId.trim()) {
    errors.push("scenario.id and scenario.fixtureId are required.");
  }
  if (!["new-build", "existing-redesign", "hybrid"].includes(scenario && scenario.workMode)) {
    errors.push("scenario.workMode is invalid.");
  }
  if (!["reference-faithful", "reference-inspired-creative"].includes(scenario && scenario.fidelity)) {
    errors.push("scenario.fidelity is invalid.");
  }
  if (!Array.isArray(d && d.runs)) errors.push("runs must be an array.");

  let valid = 0;
  for (const [i, run] of runs.entries()) {
    const tag = "runs[" + i + "]", before = errors.length;
    if (!run || typeof run.runId !== "string" || !run.runId.trim() || ids.has(run.runId)) {
      errors.push(tag + ": runId missing or duplicated.");
    } else {
      ids.add(run.runId);
    }

    for (const key of ["id", "model", "runtime", "skillVersion"]) {
      if (typeof (run && run.agent && run.agent[key]) !== "string" || !run.agent[key].trim()) {
        errors.push(tag + ": agent." + key + " required.");
      }
    }
    if (!run || typeof run.measuredAt !== "string" || Number.isNaN(Date.parse(run.measuredAt))) {
      errors.push(tag + ": measuredAt invalid.");
    }

    const quality = run && run.quality, usage = run && run.usage;
    if (!quality || !STATUSES.includes(quality.visualReview) ||
        !STATUSES.includes(quality.functionalRegression) ||
        !Number.isInteger(quality.criticalDefects) || quality.criticalDefects < 0) {
      errors.push(tag + ": quality statuses and criticalDefects required.");
    }
    if (!usage || !SOURCES.includes(usage.source)) errors.push(tag + ": usage.source invalid.");
    for (const key of ["inputTokens", "outputTokens"]) {
      if (usage && usage[key] != null && (!Number.isSafeInteger(usage[key]) || usage[key] < 0)) {
        errors.push(tag + ": " + key + " must be a non-negative safe integer or null.");
      }
    }
    if (usage && ["provider-runtime", "host-runtime"].includes(usage.source) &&
        (!Number.isSafeInteger(usage.inputTokens) || usage.inputTokens < 0 ||
         !Number.isSafeInteger(usage.outputTokens) || usage.outputTokens < 0 ||
         !Number.isSafeInteger(usage.inputTokens + usage.outputTokens))) {
      errors.push(tag + ": measured usage requires non-negative safe integer inputTokens/outputTokens and a safe total.");
    }
    if (usage && usage.actualCostUsd != null &&
        (!Number.isFinite(usage.actualCostUsd) || usage.actualCostUsd < 0 ||
         !["provider-runtime", "host-runtime"].includes(usage.costSource))) {
      errors.push(tag + ": actualCostUsd requires a non-negative value and provider/host costSource.");
    }
    if (!Array.isArray(run && run.evidence)) errors.push(tag + ": evidence must be an array.");
    if (Array.isArray(run && run.evidence)) {
      for (const file of run.evidence) {
        if (!await hasFile(base, file)) errors.push(tag + ": evidence missing or outside root: " + file);
      }
    }
    if (quality && (quality.visualReview === "pass" || quality.functionalRegression === "pass") &&
        (!Array.isArray(run.evidence) || !run.evidence.length)) {
      errors.push(tag + ": passing quality claims require evidence.");
    }
    if (usage && usage.source === "estimated") warnings.push(tag + ": estimates are excluded from savings comparisons.");
    if (!errors.slice(before).some(error => error.startsWith(tag))) valid++;
  }

  if (!runs.length && !errors.length) warnings.push("No runs recorded; no savings claim can be made.");
  return {
    schemaVersion: "1.0.0",
    status: errors.length ? "fail" : runs.length ? "pass" : "not-tested",
    benchmarkId: d && d.benchmarkId || null,
    runCount: valid,
    errors,
    warnings,
    limitation: "Schema/evidence references are checked; provider usage, runtime identity, benchmark fairness, and agent declarations are not independently verified."
  };
}

const median = values => {
  const sorted = [...values].sort((a, b) => a - b), i = Math.floor(sorted.length / 2);
  return !sorted.length ? null : sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2;
};
const qualityPass = runs => runs.length > 0 && runs.every(run =>
  run.quality && run.quality.visualReview === "pass" &&
  run.quality.functionalRegression === "pass" && run.quality.criticalDefects === 0
);

export function compareBenchmarks(a, b, minimumRuns = 3) {
  if (!a || !b || !Array.isArray(a.runs) || !Array.isArray(b.runs)) {
    return { status: "invalid-report", reason: "Both reports must contain a runs array.", tokenSavingsPercent: null };
  }
  const scenarioKey = report => JSON.stringify([
    report.scenario && report.scenario.id,
    report.scenario && report.scenario.fixtureId,
    report.scenario && report.scenario.workMode,
    report.scenario && report.scenario.fidelity
  ]);
  if (scenarioKey(a) !== scenarioKey(b)) {
    return { status: "not-comparable", reason: "Scenario/fixture/work/fidelity differs.", tokenSavingsPercent: null };
  }

  const baseline = a.runs, candidate = b.runs;
  const agentKey = run => JSON.stringify([
    run && run.agent && run.agent.id,
    run && run.agent && run.agent.model,
    run && run.agent && run.agent.runtime
  ]);
  if (!baseline.length || !candidate.length ||
      baseline.some(run => !run || !run.agent) || candidate.some(run => !run || !run.agent) ||
      new Set(baseline.map(agentKey)).size !== 1 ||
      new Set(candidate.map(agentKey)).size !== 1 ||
      agentKey(baseline[0]) !== agentKey(candidate[0])) {
    return { status: "not-comparable", reason: "Agent/model/runtime must match.", tokenSavingsPercent: null };
  }

  const baselineQuality = qualityPass(baseline), candidateQuality = qualityPass(candidate);
  if (!baselineQuality || !candidateQuality) {
    return {
      status: baselineQuality && !candidateQuality ? "quality-regression" : "quality-not-eligible",
      quality: { baselinePass: baselineQuality, candidatePass: candidateQuality },
      tokenSavingsPercent: null,
      costSavingsPercent: null
    };
  }
  if (!Number.isInteger(minimumRuns) || minimumRuns < 1) {
    return { status: "invalid-minimum-runs", reason: "minimumRuns must be a positive integer.", tokenSavingsPercent: null };
  }
  if (baseline.length < minimumRuns || candidate.length < minimumRuns) {
    return {
      status: "insufficient-samples",
      minimumRuns,
      counts: { baseline: baseline.length, candidate: candidate.length },
      tokenSavingsPercent: null
    };
  }

  const sources = runs => [...new Set(runs.map(run => run && run.usage && run.usage.source))];
  const baselineSources = sources(baseline), candidateSources = sources(candidate);
  if (baselineSources.length !== 1 || candidateSources.length !== 1 ||
      baselineSources[0] !== candidateSources[0] ||
      !["provider-runtime", "host-runtime"].includes(baselineSources[0])) {
    return {
      status: "usage-not-measured",
      usageSources: { baseline: baselineSources, candidate: candidateSources },
      tokenSavingsPercent: null
    };
  }

  const validUsage = runs => runs.every(run => {
    const usage = run && run.usage;
    return usage &&
      Number.isSafeInteger(usage.inputTokens) && usage.inputTokens >= 0 &&
      Number.isSafeInteger(usage.outputTokens) && usage.outputTokens >= 0 &&
      Number.isSafeInteger(usage.inputTokens + usage.outputTokens);
  });
  if (!validUsage(baseline) || !validUsage(candidate)) {
    return { status: "invalid-usage", reason: "Measured token counts must be non-negative safe integers with a safe total.", tokenSavingsPercent: null };
  }

  const baselineTokens = median(baseline.map(run => run.usage.inputTokens + run.usage.outputTokens));
  const candidateTokens = median(candidate.map(run => run.usage.inputTokens + run.usage.outputTokens));
  if (!(baselineTokens > 0)) return { status: "invalid-baseline", tokenSavingsPercent: null };

  const baselineCostSources = [...new Set(baseline.map(run => run.usage && run.usage.costSource))];
  const candidateCostSources = [...new Set(candidate.map(run => run.usage && run.usage.costSource))];
  const costValid = runs => runs.every(run => run.usage &&
    Number.isFinite(run.usage.actualCostUsd) && run.usage.actualCostUsd >= 0);
  const costComparable = costValid(baseline) && costValid(candidate) &&
    baselineCostSources.length === 1 && candidateCostSources.length === 1 &&
    baselineCostSources[0] === candidateCostSources[0] &&
    ["provider-runtime", "host-runtime"].includes(baselineCostSources[0]);
  const baselineCost = costComparable ? median(baseline.map(run => run.usage.actualCostUsd)) : null;
  const candidateCost = costComparable ? median(candidate.map(run => run.usage.actualCostUsd)) : null;
  const delta = (candidateTokens - baselineTokens) / baselineTokens * 100;

  return {
    status: "comparable",
    sampleCount: { baseline: baseline.length, candidate: candidate.length },
    usageSource: baselineSources[0],
    quality: { baselinePass: true, candidatePass: true, criticalDefectsBaseline: 0, criticalDefectsCandidate: 0 },
    tokens: {
      baselineMedian: baselineTokens,
      candidateMedian: candidateTokens,
      deltaPercent: +delta.toFixed(2),
      savingsPercent: +(-delta).toFixed(2)
    },
    cost: costComparable ? {
      source: baselineCostSources[0],
      baselineMedianUsd: baselineCost,
      candidateMedianUsd: candidateCost,
      savingsPercent: baselineCost > 0 ? +((baselineCost - candidateCost) / baselineCost * 100).toFixed(2) : null
    } : null,
    explanation: "Savings use only measured provider/host usage, identical fixture and agent/model/runtime, repeated runs, and passing visual/functional quality with zero critical defects. Estimates are excluded."
  };
}

async function main() {
  const args = process.argv.slice(2);
  const get = name => {
    const index = args.indexOf(name);
    return index < 0 ? null : args[index + 1];
  };

  if (args.includes("--help") || args.includes("-h")) {
    console.log("benchmark.mjs validate --file <benchmark.json> [--root .] | compare --baseline <base.json> --candidate <next.json> [--root .] [--minimum-runs 3]");
    return;
  }

  if (args[0] === "validate") {
    const file = get("--file");
    if (!file) throw new Error("Required relative --file.");
    const root = await realpath(path.resolve(get("--root") || "."));
    const report = await readJsonWithinRoot(root, file, "--file");
    const result = await validateBenchmark(report, root);
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== "pass") process.exitCode = 1;
    return;
  }

  if (args[0] === "compare") {
    const baselinePath = get("--baseline"), candidatePath = get("--candidate");
    const minimumRuns = Number(get("--minimum-runs") || 3);
    if (!baselinePath || !candidatePath || !Number.isInteger(minimumRuns) || minimumRuns < 1) {
      throw new Error("Required baseline/candidate and positive minimum-runs.");
    }

    const root = await realpath(path.resolve(get("--root") || "."));
    const [baseline, candidate] = await Promise.all([
      readJsonWithinRoot(root, baselinePath, "--baseline"),
      readJsonWithinRoot(root, candidatePath, "--candidate")
    ]);
    const [baselineValidation, candidateValidation] = await Promise.all([
      validateBenchmark(baseline, root),
      validateBenchmark(candidate, root)
    ]);
    const validation = { baseline: baselineValidation, candidate: candidateValidation };

    if (baselineValidation.status !== "pass" || candidateValidation.status !== "pass") {
      console.log(JSON.stringify({
        status: "validation-failed",
        reason: "Both benchmark reports must pass schema, measured-usage, and evidence validation before comparison.",
        validation,
        comparison: null
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    const comparison = compareBenchmarks(baseline, candidate, minimumRuns);
    console.log(JSON.stringify({ ...comparison, validation }, null, 2));
    if (comparison.status !== "comparable") process.exitCode = 1;
    return;
  }

  throw new Error("Use validate or compare.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 2;
  });
}
