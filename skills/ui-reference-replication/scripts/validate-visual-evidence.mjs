#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const SEVERITIES = new Set(["critical", "high", "medium", "low", "info"]);
const FINDING_STATES = new Set(["open", "fixed", "accepted", "not-applicable"]);

function parseArgs(argv) {
  const options = { file: null, root: process.cwd(), json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "--file" || arg === "--root") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      options[arg === "--file" ? "file" : "root"] = value;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!options.file) throw new Error("Required: --file <visual-evidence.json>");
  options.root = path.resolve(options.root);
  options.file = path.resolve(options.root, options.file);
  return options;
}

function usage() {
  return [
    "Validate visual evidence manifest and review record",
    "",
    "Usage:",
    "  node validate-visual-evidence.mjs --file <manifest.json> [--root .] [--json]",
    "",
    "Checks file existence, path containment, PNG dimensions, hashes,",
    "route/viewport/state metadata, and a declared visual-review record.",
    "It cannot independently prove that a model actually perceived the images."
  ].join("\n");
}

function addError(errors, captureId, message) {
  errors.push({ captureId, message });
}

function inspectPng(buffer, label) {
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE) || buffer.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`${label} is not a valid PNG header.`);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width < 1 || height < 1) throw new Error(`${label} has invalid dimensions.`);
  return { width, height };
}

function safeFile(root, relativePath, label) {
  if (typeof relativePath !== "string" || !relativePath.trim()) throw new Error(`${label} path is required.`);
  if (path.isAbsolute(relativePath)) throw new Error(`${label} path must be relative to --root.`);
  const resolved = path.resolve(root, relativePath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error(`${label} path escapes the evidence root.`);
  }
  return resolved;
}

async function validateManifest({ file, root }) {
  const errors = [];
  const warnings = [];
  let manifest;
  try {
    manifest = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    return { status: "fail", errors: [{ message: `Cannot read manifest: ${error.message}` }], warnings, captures: [] };
  }

  if (!manifest || manifest.schemaVersion !== "1.0.0") errors.push({ message: "schemaVersion must be 1.0.0." });
  if (!manifest.task || typeof manifest.task.id !== "string" || !manifest.task.id.trim()) {
    errors.push({ message: "task.id is required." });
  }
  if (!Array.isArray(manifest.captures) || manifest.captures.length === 0) {
    errors.push({ message: "captures must contain at least one evidence pair." });
    return { status: "fail", errors, warnings, captures: [] };
  }

  const checked = [];
  const seenIds = new Set();
  for (const capture of manifest.captures) {
    const id = typeof capture?.id === "string" && capture.id.trim() ? capture.id : "(missing-id)";
    const before = errors.length;
    if (id === "(missing-id)") addError(errors, id, "capture.id is required.");
    if (seenIds.has(id)) addError(errors, id, "capture.id must be unique.");
    seenIds.add(id);
    if (typeof capture?.route !== "string" || !capture.route.trim()) addError(errors, id, "route is required.");
    if (typeof capture?.state !== "string" || !capture.state.trim()) addError(errors, id, "state is required.");

    const viewport = capture?.viewport;
    if (!viewport || !Number.isInteger(viewport.width) || viewport.width < 1 ||
        !Number.isInteger(viewport.height) || viewport.height < 1 ||
        !Number.isFinite(viewport.deviceScaleFactor) || viewport.deviceScaleFactor <= 0) {
      addError(errors, id, "viewport requires positive integer width/height and positive deviceScaleFactor.");
    }

    let referenceImage = null;
    let implementationImage = null;
    try {
      const referencePath = safeFile(root, capture?.reference?.path, "reference");
      const referenceBytes = await readFile(referencePath);
      const dimensions = inspectPng(referenceBytes, "reference");
      referenceImage = {
        path: path.relative(root, referencePath).split(path.sep).join("/"),
        dimensions,
        sha256: createHash("sha256").update(referenceBytes).digest("hex")
      };
    } catch (error) {
      addError(errors, id, error.message);
    }

    try {
      const implementationPath = safeFile(root, capture?.implementation?.path, "implementation");
      const implementationBytes = await readFile(implementationPath);
      const dimensions = inspectPng(implementationBytes, "implementation");
      implementationImage = {
        path: path.relative(root, implementationPath).split(path.sep).join("/"),
        dimensions,
        sha256: createHash("sha256").update(implementationBytes).digest("hex")
      };
    } catch (error) {
      addError(errors, id, error.message);
    }

    if (referenceImage && implementationImage &&
        (referenceImage.dimensions.width !== implementationImage.dimensions.width ||
         referenceImage.dimensions.height !== implementationImage.dimensions.height)) {
      addError(errors, id, "Reference and implementation PNG dimensions must match.");
    }

    const review = capture?.visualReview;
    if (!review || review.status !== "reviewed") {
      addError(errors, id, "visualReview.status must be reviewed; unreviewed screenshots cannot pass this gate.");
    } else {
      if (review.inspectedReference !== true) addError(errors, id, "visualReview.inspectedReference must be true.");
      if (review.inspectedImplementation !== true) addError(errors, id, "visualReview.inspectedImplementation must be true.");
      if (typeof review.reviewer !== "string" || !review.reviewer.trim()) addError(errors, id, "visualReview.reviewer is required.");
      if (typeof review.reviewedAt !== "string" || Number.isNaN(Date.parse(review.reviewedAt))) {
        addError(errors, id, "visualReview.reviewedAt must be a parseable date/time.");
      }
      if (typeof review.summary !== "string" || review.summary.trim().length < 10) {
        addError(errors, id, "visualReview.summary must contain at least 10 characters.");
      }
      if (!Array.isArray(review.findings)) {
        addError(errors, id, "visualReview.findings must be an array (use [] when no issue was found).");
      } else {
        for (const finding of review.findings) {
          if (!SEVERITIES.has(finding?.severity)) addError(errors, id, "Each finding requires severity: critical/high/medium/low/info.");
          if (typeof finding?.description !== "string" || !finding.description.trim()) addError(errors, id, "Each finding requires a description.");
          if (!FINDING_STATES.has(finding?.status)) addError(errors, id, "Each finding requires status: open/fixed/accepted/not-applicable.");
        }
      }
      if (review.attestation !== "agent-declared") {
        addError(errors, id, 'visualReview.attestation must be "agent-declared" to disclose that this is a declared review.');
      }
    }

    if (errors.length === before) {
      checked.push({
        id, route: capture.route, state: capture.state, viewport,
        reference: referenceImage, implementation: implementationImage,
        visualReview: {
          status: review.status, reviewer: review.reviewer, reviewedAt: review.reviewedAt,
          findingCount: review.findings.length,
          openFindings: review.findings.filter(item => item.status === "open").length
        }
      });
    }
  }

  if (manifest.task?.workMode && !["new-build", "existing-redesign", "hybrid"].includes(manifest.task.workMode)) {
    errors.push({ message: "task.workMode must be new-build, existing-redesign, or hybrid." });
  }
  if (manifest.task?.fidelity && !["reference-faithful", "reference-inspired-creative"].includes(manifest.task.fidelity)) {
    errors.push({ message: "task.fidelity must be reference-faithful or reference-inspired-creative." });
  }

  warnings.push("Visual review is agent-declared. File hashes and manifest validation do not independently prove image perception or design correctness.");
  return {
    status: errors.length ? "fail" : "pass",
    manifest: path.relative(root, file).split(path.sep).join("/"),
    task: manifest.task?.id ?? null,
    checkedCaptureCount: checked.length,
    captures: checked,
    errors,
    warnings
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) console.log(usage());
  else {
    const report = await validateManifest(options);
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== "pass") process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  console.error("Run with --help for usage.");
  process.exitCode = 2;
}

export { inspectPng, safeFile };
