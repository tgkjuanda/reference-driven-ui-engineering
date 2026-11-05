#!/usr/bin/env node
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { validateTokenDocument } from "../skills/ui-reference-replication/scripts/validate-tokens.mjs";

const root = process.cwd();
const errors = [];
const warnings = [];
async function mustExist(relative) {
  try { await access(path.join(root, relative)); }
  catch { errors.push(`Missing required file: ${relative}`); }
}
const skillPath = "skills/ui-reference-replication/SKILL.md";
await mustExist(skillPath);
for (const relative of [
  "skills/ui-reference-replication/references/token-efficient-execution.md",
  "skills/ui-reference-replication/scripts/plan-task.mjs",
  "skills/ui-reference-replication/scripts/validate-visual-evidence.mjs",
  "skills/ui-reference-replication/scripts/validate-visual-review.mjs",
  "skills/ui-reference-replication/templates/perceptual-visual-review.example.json",
  "skills/ui-reference-replication/scripts/run-functional-regression.mjs",
  "skills/ui-reference-replication/scripts/compare-regression.mjs",
  "skills/ui-reference-replication/scripts/responsive-audit.mjs",
  "skills/ui-reference-replication/scripts/performance-audit.mjs",
  "skills/ui-reference-replication/scripts/security-audit.mjs",
  "skills/ui-reference-replication/references/performance-security.md",
  "skills/ui-reference-replication/templates/responsive-audit.example.json",
  "skills/ui-reference-replication/templates/performance-budget.example.json",
  "skills/ui-reference-replication/scripts/responsive-audit.mjs",
  "skills/ui-reference-replication/scripts/performance-audit.mjs",
  "skills/ui-reference-replication/scripts/security-audit.mjs",
  "skills/ui-reference-replication/templates/responsive-audit.example.json",
  "skills/ui-reference-replication/templates/performance-budget.example.json",
  "skills/ui-reference-replication/templates/functional-regression.example.json",
  "skills/ui-reference-replication/templates/visual-evidence.example.json",
  "skills/ui-reference-replication/references/visual-capability-gate.md",
  "skills/ui-reference-replication/references/existing-ui-redesign.md",
  "skills/ui-reference-replication/references/creative-reference-mode.md",
  "skills/ui-reference-replication/references/anti-ai-slop.md",
  "skills/ui-reference-replication/references/figma-analysis.md",
  "skills/ui-reference-replication/references/design-system-engineering.md",
  "skills/ui-reference-replication/references/accessibility.md",
  "skills/ui-reference-replication/references/responsive-and-interactions.md",
  "skills/ui-reference-replication/references/motion-design.md",
  "skills/ui-reference-replication/references/visual-qa.md",
  "skills/ui-reference-replication/references/evidence-and-visual-qa.md",
  "skills/ui-reference-replication/scripts/inspect-project.mjs",
  "skills/ui-reference-replication/scripts/validate-tokens.mjs",
  "skills/ui-reference-replication/scripts/capture-screenshots.mjs",
  "skills/ui-reference-replication/scripts/accessibility-audit.mjs",
  "skills/ui-reference-replication/scripts/compare-screenshots.py"
]) await mustExist(relative);

const skill = await readFile(path.join(root, skillPath), "utf8");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const versionMatch = skill.match(/^  version: "([^"]+)"$/m);
if (!versionMatch) errors.push("SKILL.md frontmatter version is missing.");
if (versionMatch && packageJson.version !== versionMatch[1]) {
  errors.push(`Version mismatch: package.json is ${packageJson.version}, SKILL.md is ${versionMatch[1]}.`);
}
if (versionMatch && !/^\d+\.\d+\.\d+$/.test(versionMatch[1])) {
  errors.push(`Invalid semantic version in SKILL.md: ${versionMatch[1]}`);
}
const lines = skill.split(/\r?\n/);
if (!skill.startsWith("---\n")) errors.push("SKILL.md must start with YAML frontmatter.");
if (lines.length > 500) errors.push(`SKILL.md has ${lines.length} lines; keep it below 500 lines.`);
for (const field of ["name: ui-reference-replication", "description:", "license: MIT"]) {
  if (!skill.includes(field)) errors.push(`SKILL.md frontmatter/content missing: ${field}`);
}
if (skill.includes("compatibility: opencode")) errors.push("Core skill must not be locked to OpenCode.");
for (const required of [
  "references/token-efficient-execution.md",
  "scripts/plan-task.mjs",
  "scripts/run-functional-regression.mjs",
  "scripts/compare-regression.mjs",
  "references/visual-capability-gate.md",
  "references/existing-ui-redesign.md",
  "references/creative-reference-mode.md",
  "references/anti-ai-slop.md",
  "references/accessibility.md",
  "references/motion-design.md",
  "If the agent cannot visually inspect both the reference and its own rendered output, **reject the Skill for this task and stop**.",
  "**Reference-Faithful:**",
  "**Reference-Inspired Creative:**",
  "Preserve, Reinterpret, Protect, and Avoid",
  "anti-AI-slop review",
  "Existing UI redesign"
]) {
  if (!skill.includes(required)) errors.push(`Core skill missing required rule: ${required}`);
}
if (!skill.includes("validate-tokens.mjs")) errors.push("Core skill does not advertise token validation.");
if (!skill.includes("capture-screenshots.mjs")) errors.push("Core skill does not advertise screenshot capture.");

const gateDoc = await readFile(path.join(root, "skills/ui-reference-replication/references/visual-capability-gate.md"), "utf8");
if (!gateDoc.includes("Mandatory rejection behavior") || !gateDoc.includes("Do not begin a text-only approximation")) {
  errors.push("Visual capability gate is missing mandatory rejection instructions.");
}

const redesign = await readFile(path.join(root, "skills/ui-reference-replication/references/existing-ui-redesign.md"), "utf8");
for (const required of ["Establish the existing-product baseline", "Regression and visual verification", "preserve", "business rules"]) {
  if (!redesign.includes(required)) errors.push(`Existing UI redesign reference missing: ${required}`);
}

const creative = await readFile(path.join(root, "skills/ui-reference-replication/references/creative-reference-mode.md"), "utf8");
for (const required of ["Preserve — design anchors", "Reinterpret — areas of creative freedom", "Protect — non-negotiable constraints", "Avoid — undesired outcomes", "Do not optimize for minimum changed-pixel ratio"]) {
  if (!creative.includes(required)) errors.push(`Creative reference mode missing: ${required}`);
}

const antiSlop = await readFile(path.join(root, "skills/ui-reference-replication/references/anti-ai-slop.md"), "utf8");
for (const required of ["product reality", "product-specific", "trend stacking", "The de-slop review", "invented testimonials"]) {
  if (!antiSlop.toLowerCase().includes(required.toLowerCase())) errors.push(`Anti-AI-slop guide missing: ${required}`);
}
const creativeGuide = await readFile(path.join(root, "skills/ui-reference-replication/references/creative-reference-mode.md"), "utf8");
if (!creativeGuide.includes("Mandatory anti-AI-slop review") || !creativeGuide.includes("anti-ai-slop.md")) {
  errors.push("Creative mode does not require the anti-AI-slop review.");
}

const plannerPath = "skills/ui-reference-replication/scripts/plan-task.mjs";
const planner = await readFile(path.join(root, plannerPath), "utf8");
if (versionMatch && !planner.includes(`version: "${versionMatch[1]}"`)) {
  errors.push("Task planner version is out of sync with SKILL.md.");
}
if (!packageJson.scripts?.["plan:task"]) errors.push("package.json must expose the plan:task script.");
if (!packageJson.scripts?.["regression"] || !packageJson.scripts?.["compare:regression"]) errors.push("package.json must expose regression and compare:regression scripts.");
if (!packageJson.scripts?.["validate:visual-review"]) errors.push("package.json must expose validate:visual-review script.");
for (const [name, file] of [["audit:responsive", "responsive-audit.mjs"], ["audit:performance", "performance-audit.mjs"], ["audit:security", "security-audit.mjs"]]) {
  if (!packageJson.scripts?.[name] || !packageJson.scripts[name].includes(file)) errors.push(`package.json must expose ${name} for ${file}.`);
}
const responsiveConfig = JSON.parse(await readFile(path.join(root, "skills/ui-reference-replication/templates/responsive-audit.example.json"), "utf8"));
if (responsiveConfig.schemaVersion !== "1.0.0" || !Array.isArray(responsiveConfig.routes)) errors.push("Responsive audit template schema is invalid.");
const performanceConfig = JSON.parse(await readFile(path.join(root, "skills/ui-reference-replication/templates/performance-budget.example.json"), "utf8"));
if (performanceConfig.schemaVersion !== "1.0.0" || !Array.isArray(performanceConfig.routes)) errors.push("Performance budget template schema is invalid.");
const responsiveScript = await readFile(path.join(root, "skills/ui-reference-replication/scripts/responsive-audit.mjs"), "utf8");
const performanceScript = await readFile(path.join(root, "skills/ui-reference-replication/scripts/performance-audit.mjs"), "utf8");
const securityScript = await readFile(path.join(root, "skills/ui-reference-replication/scripts/security-audit.mjs"), "utf8");
if (!responsiveScript.includes("evaluateResponsiveSnapshot") || !performanceScript.includes("evaluatePerformanceMetrics") || !securityScript.includes("scanSourceText")) {
  errors.push("Responsive/performance/security tooling is missing deterministic testable exports.");
}
const regressionTemplate = JSON.parse(await readFile(path.join(root, "skills/ui-reference-replication/templates/functional-regression.example.json"), "utf8"));
if (regressionTemplate.schemaVersion !== "1.0.0" || !Array.isArray(regressionTemplate.checks)) {
  errors.push("Functional regression example must contain schemaVersion 1.0.0 and a checks array.");
}
const regressionRunner = await readFile(path.join(root, "skills/ui-reference-replication/scripts/run-functional-regression.mjs"), "utf8");
const regressionComparator = await readFile(path.join(root, "skills/ui-reference-replication/scripts/compare-regression.mjs"), "utf8");
if (!regressionRunner.includes("validateConfig") || !regressionComparator.includes("compareReports")) {
  errors.push("Functional regression runner/comparator is missing its validation exports.");
}

const visualReviewTemplate = JSON.parse(await readFile(path.join(root, "skills/ui-reference-replication/templates/perceptual-visual-review.example.json"), "utf8"));
if (visualReviewTemplate.schemaVersion !== "1.0.0" || !Array.isArray(visualReviewTemplate.reviews)) {
  errors.push("Perceptual visual review template must contain schemaVersion 1.0.0 and a reviews array.");
}
const visualReviewValidator = await readFile(path.join(root, "skills/ui-reference-replication/scripts/validate-visual-review.mjs"), "utf8");
for (const required of ["reference-fidelity", "design-anchors", "product-fit", "originality", "anti-slop", "not-tested"]) {
  if (!visualReviewValidator.includes(required)) errors.push(`Visual review validator missing required mode/dimension: ${required}`);
}

const evidenceTemplate = JSON.parse(await readFile(path.join(root, "skills/ui-reference-replication/templates/visual-evidence.example.json"), "utf8"));
if (evidenceTemplate.schemaVersion !== "1.0.0" || !Array.isArray(evidenceTemplate.captures)) {
  errors.push("Visual evidence example must contain schemaVersion 1.0.0 and a captures array.");
}
const evidenceValidator = await readFile(path.join(root, "skills/ui-reference-replication/scripts/validate-visual-evidence.mjs"), "utf8");
if (!evidenceValidator.includes("agent-declared") || !evidenceValidator.includes("createHash")) {
  errors.push("Visual evidence validator must disclose agent-declared review and generate image hashes.");
}

const tokenFile = "skills/ui-reference-replication/templates/design-tokens.example.json";
await mustExist(tokenFile);
const tokenDocument = JSON.parse(await readFile(path.join(root, tokenFile), "utf8"));
const tokenResult = validateTokenDocument(tokenDocument);
if (!tokenResult.valid) errors.push(`Token sample invalid: ${JSON.stringify(tokenResult.errors)}`);
if (tokenResult.warnings.length) warnings.push(...tokenResult.warnings.map(item => item.message));

const result = {
  status: errors.length ? "fail" : "pass",
  skillLines: lines.length,
  tokenCount: tokenResult.tokenCount,
  aliasCount: tokenResult.aliasCount,
  errors,
  warnings
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
