#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];

async function mustExist(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    errors.push("Required Community Edition file is missing: " + relativePath);
  }
}

async function read(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch (error) {
    errors.push("Cannot read " + relativePath + ": " + error.message);
    return "";
  }
}

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  ".agents/rules/ui-reference-replication.md",
  "skills/ui-reference-replication/SKILL.md",
  "skills/ui-reference-replication/references/visual-capability-gate.md",
  "skills/ui-reference-replication/references/existing-ui-redesign.md",
  "skills/ui-reference-replication/references/design-system-engineering.md",
  "skills/ui-reference-replication/references/responsive-and-interactions.md",
  "skills/ui-reference-replication/references/accessibility.md",
  "skills/ui-reference-replication/references/visual-qa.md",
  "skills/ui-reference-replication/scripts/inspect-project.mjs",
  "skills/ui-reference-replication/scripts/capture-screenshots.mjs",
  "skills/ui-reference-replication/scripts/compare-screenshots.py",
  "skills/ui-reference-replication/scripts/validate-tokens.mjs",
  "skills/ui-reference-replication/scripts/accessibility-audit.mjs",
  "skills/ui-reference-replication/templates/design-tokens.example.json"
];
for (const file of requiredFiles) await mustExist(file);

const skill = await read("skills/ui-reference-replication/SKILL.md");
const rule = await read(".agents/rules/ui-reference-replication.md");
const packageJson = JSON.parse(await read("package.json") || "{}");

const version = skill.match(/^  version: "([^"]+)"$/m)?.[1];
if (!skill.startsWith("---\n")) errors.push("SKILL.md must begin with YAML frontmatter.");
if (!version) errors.push("SKILL.md frontmatter version is missing.");
if (version && packageJson.version !== version) errors.push("package.json and SKILL.md versions do not match.");
if (version && !/^\d+\.\d+\.\d+$/.test(version)) errors.push("Skill version must use semantic versioning.");
if (skill.split(/\r?\n/).length > 500) errors.push("SKILL.md must remain below 500 lines.");

for (const required of [
  "name: ui-reference-replication",
  "description:",
  "license: MIT",
  "Reference-Faithful",
  "visual capability gate",
  "Existing UI Redesign",
  "preserving",
  "capture-screenshots.mjs",
  "compare-screenshots.py"
]) {
  if (!skill.toLowerCase().includes(required.toLowerCase())) {
    errors.push("SKILL.md is missing required Community Edition content: " + required);
  }
}

const description = skill.match(/^description:\s*(.+)$/m)?.[1]?.toLowerCase() ?? "";
for (const keyword of ["screenshots", "reference", "mockups", "wireframes", "by default"]) {
  if (!description.includes(keyword)) errors.push("Skill description is missing routing keyword: " + keyword);
}

if (!rule.startsWith("---\ntrigger: always_on\n")) errors.push("Antigravity routing rule must use trigger: always_on.");
for (const required of ["ui-reference-replication", "Reference-Faithful", "visual-capability gate", "without requiring the user to mention the Skill"]) {
  if (!rule.toLowerCase().includes(required.toLowerCase())) errors.push("Antigravity rule is missing: " + required);
}

const editionBoundary = skill.split("## Edition boundary")[1]?.split("\n## ")[0] ?? "";
const operationalSkill = skill.replace(editionBoundary, "");
for (const forbidden of [
  "Reference-Inspired Creative",
  "creative-reference-mode.md",
  "anti-ai-slop.md",
  "design-intelligence.md",
  "motion-design.md",
  "benchmark.mjs",
  "validate-quality-report.mjs",
  "plan-task.mjs"
]) {
  if (operationalSkill.includes(forbidden)) errors.push("Premium-only capability leaked into the Community workflow: " + forbidden);
}

const packageScripts = packageJson.scripts ?? {};
for (const script of ["test", "check", "validate:tokens", "capture:screenshots"]) {
  if (!packageScripts[script]) errors.push("package.json is missing script: " + script);
}
for (const script of ["plan:task", "benchmark:validate", "benchmark:compare", "validate:quality-report", "compatibility:validate", "regression", "compare:regression"]) {
  if (packageScripts[script]) errors.push("Premium-only command remains in package.json: " + script);
}

const tokenPath = "skills/ui-reference-replication/templates/design-tokens.example.json";
try {
  const tokens = JSON.parse(await read(tokenPath));
  if (!tokens || typeof tokens !== "object" || Array.isArray(tokens)) errors.push("Design-token example must be a JSON object.");
} catch (error) {
  errors.push("Design-token example is invalid JSON: " + error.message);
}

const premiumOnlyPaths = [
  "skills/ui-reference-replication/references/creative-reference-mode.md",
  "skills/ui-reference-replication/references/anti-ai-slop.md",
  "skills/ui-reference-replication/references/design-intelligence.md",
  "skills/ui-reference-replication/references/motion-design.md",
  "skills/ui-reference-replication/references/benchmark-protocol.md",
  "skills/ui-reference-replication/scripts/benchmark.mjs",
  "skills/ui-reference-replication/scripts/plan-task.mjs",
  "skills/ui-reference-replication/scripts/validate-quality-report.mjs",
  "skills/ui-reference-replication/templates/quality-report.example.json"
];
for (const file of premiumOnlyPaths) {
  try {
    await access(path.join(root, file));
    errors.push("Premium-only file remains in Community Edition: " + file);
  } catch {}
}

const result = {
  status: errors.length ? "fail" : "pass",
  version: version ?? null,
  requiredFiles: requiredFiles.length,
  errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
