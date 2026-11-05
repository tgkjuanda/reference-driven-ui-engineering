#!/usr/bin/env node
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const STATUSES = new Set(["pass", "partial", "fail", "not-tested"]);
const BASE_GATES = ["visual-evidence", "visual-review", "functional-regression", "responsive", "accessibility", "performance", "dependency-security", "design-system"];
export function requiredGates(task) {
  const gates = [...BASE_GATES];
  if (task && task.motionInScope === true) gates.push("motion");
  if (task && ["existing-redesign", "hybrid"].includes(task.workMode)) gates.push("existing-behavior");
  if (task && task.fidelity === "reference-inspired-creative") gates.push("creative-originality");
  return gates;
}
async function evidenceExists(root, relative) {
  if (typeof relative !== "string" || !relative.trim() || path.isAbsolute(relative)) return false;
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) return false;
  try {
    const resolved = await realpath(target);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) return false;
    return (await stat(resolved)).isFile();
  } catch { return false; }
}
export async function validateQualityReport(report, root = process.cwd()) {
  const errors = [], normalizedRoot = await realpath(root), task = report && report.task;
  if (!report || report.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0.");
  if (!task || typeof task.id !== "string" || !task.id.trim()) errors.push("task.id is required.");
  if (!["new-build", "existing-redesign", "hybrid"].includes(task && task.workMode)) errors.push("task.workMode is invalid.");
  if (!["reference-faithful", "reference-inspired-creative"].includes(task && task.fidelity)) errors.push("task.fidelity is invalid.");
  if (typeof (task && task.motionInScope) !== "boolean") errors.push("task.motionInScope must be a boolean.");
  if (!Array.isArray(report && report.gates)) errors.push("gates must be an array.");
  if (!Array.isArray(report && report.gates)) return { status: "fail", errors, summary: null, requiredGates: requiredGates(task) };
  const required = requiredGates(task), byId = new Map();
  for (const gate of report.gates) {
    if (!gate || typeof gate.id !== "string" || !gate.id.trim()) { errors.push("Every gate requires an id."); continue; }
    if (byId.has(gate.id)) errors.push("Duplicate gate id: " + gate.id);
    byId.set(gate.id, gate);
  }
  for (const id of required) if (!byId.has(id)) errors.push("Missing required quality gate: " + id);
  const outcomes = [];
  for (const id of required) {
    const gate = byId.get(id);
    if (!gate) continue;
    const before = errors.length;
    if (!STATUSES.has(gate.status)) errors.push(id + ": status must be pass, partial, fail, or not-tested.");
    if (typeof gate.summary !== "string" || !gate.summary.trim()) errors.push(id + ": summary is required.");
    if (!Array.isArray(gate.evidence)) errors.push(id + ": evidence must be an array.");
    const evidence = Array.isArray(gate.evidence) ? gate.evidence : [], checked = [];
    for (const item of evidence) {
      if (typeof item !== "string" || !item.trim()) { errors.push(id + ": evidence entries must be non-empty relative paths."); continue; }
      const exists = await evidenceExists(normalizedRoot, item);
      checked.push({ path: item, exists });
      if (!exists) errors.push(id + ": evidence file is missing or escapes the report root: " + item);
    }
    if (gate.status === "pass" && evidence.length === 0) errors.push(id + ": a passing gate requires at least one evidence file.");
    if (["partial", "fail"].includes(gate.status) && (typeof gate.nextAction !== "string" || !gate.nextAction.trim())) errors.push(id + ": partial/fail requires nextAction.");
    if (gate.status === "not-tested" && (typeof gate.reason !== "string" || !gate.reason.trim())) errors.push(id + ": not-tested requires a reason.");
    if (errors.length === before) outcomes.push({ id, status: gate.status, summary: gate.summary, evidence: checked, nextAction: gate.nextAction ?? null, reason: gate.reason ?? null });
  }
  const hasFail = outcomes.some(item => item.status === "fail"), hasPartial = outcomes.some(item => item.status === "partial" || item.status === "not-tested");
  const status = errors.length || hasFail ? "fail" : hasPartial ? "partial" : "pass";
  return {
    schemaVersion: "1.0.0", task: task && task.id ? task.id : null, status, requiredGates: required,
    summary: { pass: outcomes.filter(item => item.status === "pass").length, partial: outcomes.filter(item => item.status === "partial").length, fail: outcomes.filter(item => item.status === "fail").length, notTested: outcomes.filter(item => item.status === "not-tested").length },
    gates: outcomes, errors,
    limitation: "This validator checks report completeness and evidence-file existence. It does not independently execute tests or prove that an agent's declarations are truthful."
  };
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node validate-quality-report.mjs --file <quality-report.json> [--root .]"); return; }
  const get = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
  const file = get("--file");
  if (!file) throw new Error("Required: --file <quality-report.json>.");
  if (path.isAbsolute(file)) throw new Error("Report file path must be relative to --root.");
  const root = path.resolve(get("--root") ?? "."), target = path.resolve(root, file);
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Report path escapes --root.");
  const realRoot = await realpath(root), realTarget = await realpath(target);
  if (realTarget !== realRoot && !realTarget.startsWith(realRoot + path.sep)) throw new Error("Report path escapes --root through a symlink.");
  const report = JSON.parse(await readFile(realTarget, "utf8")), result = await validateQualityReport(report, realRoot);
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== "pass") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 2; });
