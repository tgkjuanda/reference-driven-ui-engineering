#!/usr/bin/env node
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BASE_DIMENSIONS = [
  "geometry", "hierarchy", "typography", "spacing",
  "color", "components", "responsive", "composition"
];
const MODES = {
  "reference-faithful": [...BASE_DIMENSIONS, "reference-fidelity"],
  "reference-inspired-creative": [...BASE_DIMENSIONS, "design-anchors", "product-fit", "originality", "anti-slop"]
};
const STATUSES = new Set(["pass", "partial", "fail", "not-tested"]);

function parseArgs(args) {
  const values = { root: process.cwd(), file: null, evidence: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (["--root", "--file", "--evidence"].includes(arg)) {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      values[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!values.file || !values.evidence) throw new Error("Required: --file <review.json> and --evidence <visual-evidence.json>.");
  values.root = path.resolve(values.root);
  return values;
}

function resolveInside(root, relative) {
  if (typeof relative !== "string" || !relative.trim() || path.isAbsolute(relative)) {
    throw new Error("Manifest paths must be non-empty and relative to --root.");
  }
  const full = path.resolve(root, relative);
  if (full !== root && !full.startsWith(root + path.sep)) throw new Error("Manifest path escapes --root.");
  return full;
}

function validateReview(review, evidence) {
  const errors = [];
  if (review?.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (!review?.task?.id || typeof review.task.id !== "string") errors.push("task.id is required.");
  const fidelity = review?.task?.fidelity;
  if (!MODES[fidelity]) errors.push("task.fidelity must be reference-faithful or reference-inspired-creative.");
  if (!Array.isArray(review?.reviews) || review.reviews.length === 0) {
    errors.push("reviews must contain at least one capture review.");
    return { status: "fail", errors, reviews: [] };
  }
  const evidenceCaptures = new Map((evidence?.captures ?? []).map(item => [item.id, item]));
  const seen = new Set();
  const reports = [];
  let overallFail = false;
  let overallPartial = false;

  for (const item of review.reviews) {
    const id = typeof item?.captureId === "string" ? item.captureId : "(missing-capture-id)";
    const before = errors.length;
    if (id === "(missing-capture-id)") errors.push({ captureId: id, message: "captureId is required." });
    if (seen.has(id)) errors.push({ captureId: id, message: "captureId must be unique." });
    seen.add(id);
    const source = evidenceCaptures.get(id);
    if (!source) errors.push({ captureId: id, message: "captureId does not exist in visual evidence manifest." });
    if (source && item.route !== source.route) errors.push({ captureId: id, message: "route does not match the visual evidence manifest." });
    if (source && item.state !== source.state) errors.push({ captureId: id, message: "state does not match the visual evidence manifest." });
    if (typeof item?.reviewer !== "string" || !item.reviewer.trim()) errors.push({ captureId: id, message: "reviewer is required." });
    if (typeof item?.reviewedAt !== "string" || Number.isNaN(Date.parse(item.reviewedAt))) errors.push({ captureId: id, message: "reviewedAt must be a parseable date/time." });
    if (item?.attestation !== "agent-declared") errors.push({ captureId: id, message: 'attestation must be "agent-declared".' });
    if (typeof item?.summary !== "string" || item.summary.trim().length < 10) errors.push({ captureId: id, message: "summary must contain at least 10 characters." });

    const required = MODES[fidelity] ?? BASE_DIMENSIONS;
    if (!Array.isArray(item?.dimensions)) {
      errors.push({ captureId: id, message: "dimensions must be an array." });
      continue;
    }
    const dimensionMap = new Map();
    for (const dimension of item.dimensions) {
      if (typeof dimension?.name !== "string" || !dimension.name.trim()) {
        errors.push({ captureId: id, message: "Every dimension requires a name." });
        continue;
      }
      if (dimensionMap.has(dimension.name)) errors.push({ captureId: id, message: `Duplicate dimension: ${dimension.name}` });
      dimensionMap.set(dimension.name, dimension);
      if (!STATUSES.has(dimension.status)) errors.push({ captureId: id, message: `Invalid status for dimension ${dimension.name}.` });
      if (typeof dimension.observation !== "string" || dimension.observation.trim().length < 5) {
        errors.push({ captureId: id, message: `Dimension ${dimension.name} requires an observation.` });
      }
      if (["partial", "fail"].includes(dimension.status)) {
        if (typeof dimension.evidence !== "string" || !dimension.evidence.trim()) {
          errors.push({ captureId: id, message: `Dimension ${dimension.name} requires evidence when partial or failed.` });
        }
        if (typeof dimension.action !== "string" || !dimension.action.trim()) {
          errors.push({ captureId: id, message: `Dimension ${dimension.name} requires an action when partial or failed.` });
        }
      }
      if (dimension.status === "not-tested" && (typeof dimension.reason !== "string" || !dimension.reason.trim())) {
        errors.push({ captureId: id, message: `Dimension ${dimension.name} requires a reason when not tested.` });
      }
      if (dimension.status === "fail") overallFail = true;
      if (["partial", "not-tested"].includes(dimension.status)) overallPartial = true;
    }
    for (const name of required) {
      if (!dimensionMap.has(name)) errors.push({ captureId: id, message: `Missing required dimension: ${name}` });
    }
    const extras = [...dimensionMap.keys()].filter(name => !required.includes(name));
    if (errors.length === before) {
      reports.push({
        captureId: id,
        route: item.route,
        state: item.state,
        status: item.dimensions.some(d => d.status === "fail") ? "fail" :
          item.dimensions.some(d => ["partial", "not-tested"].includes(d.status)) ? "partial" : "pass",
        dimensions: item.dimensions.map(d => ({ name: d.name, status: d.status, observation: d.observation, evidence: d.evidence ?? null, action: d.action ?? null, reason: d.reason ?? null })),
        extraDimensions: extras
      });
    }
  }

  const gateStatus = errors.length || overallFail ? "fail" : overallPartial ? "partial" : "pass";
  return {
    status: gateStatus,
    task: review?.task?.id ?? null,
    fidelity,
    reviewedCaptureCount: reports.length,
    requiredDimensions: MODES[fidelity] ?? [],
    summary: {
      pass: reports.reduce((sum, item) => sum + item.dimensions.filter(d => d.status === "pass").length, 0),
      partial: reports.reduce((sum, item) => sum + item.dimensions.filter(d => d.status === "partial").length, 0),
      fail: reports.reduce((sum, item) => sum + item.dimensions.filter(d => d.status === "fail").length, 0),
      notTested: reports.reduce((sum, item) => sum + item.dimensions.filter(d => d.status === "not-tested").length, 0)
    },
    reviews: reports,
    errors,
    limitations: [
      "This scorecard structures an agent-declared perceptual review; it does not compute visual understanding or prove that image perception occurred.",
      "No single numeric similarity or design-quality score is generated. Review findings must be interpreted with the source images and product context."
    ]
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log("Usage: node validate-visual-review.mjs --file <review.json> --evidence <visual-evidence.json> [--root .]");
    return;
  }
  const reviewPath = resolveInside(options.root, options.file);
  const evidencePath = resolveInside(options.root, options.evidence);
  const [reviewText, evidenceText] = await Promise.all([
    readFile(reviewPath, "utf8"),
    readFile(evidencePath, "utf8")
  ]);
  const report = validateReview(JSON.parse(reviewText), JSON.parse(evidenceText));
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 2;
  });
}

export { validateReview, resolveInside, MODES };
