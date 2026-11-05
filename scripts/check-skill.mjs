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
  "skills/ui-reference-replication/references/figma-analysis.md",
  "skills/ui-reference-replication/references/design-system-engineering.md",
  "skills/ui-reference-replication/references/accessibility.md",
  "skills/ui-reference-replication/references/responsive-and-interactions.md",
  "skills/ui-reference-replication/references/visual-qa.md",
  "skills/ui-reference-replication/references/evidence-and-visual-qa.md",
  "skills/ui-reference-replication/scripts/inspect-project.mjs",
  "skills/ui-reference-replication/scripts/validate-tokens.mjs",
  "skills/ui-reference-replication/scripts/capture-screenshots.mjs",
  "skills/ui-reference-replication/scripts/accessibility-audit.mjs",
  "skills/ui-reference-replication/scripts/compare-screenshots.py"
]) await mustExist(relative);

const skill = await readFile(path.join(root, skillPath), "utf8");
const lines = skill.split(/\r?\n/);
if (!skill.startsWith("---\n")) errors.push("SKILL.md must start with YAML frontmatter.");
if (lines.length > 500) errors.push(`SKILL.md has ${lines.length} lines; keep it below 500 lines.`);
for (const field of ["name: ui-reference-replication", "description:", "license: MIT", "version: \"2.0.0\""]) {
  if (!skill.includes(field)) errors.push(`SKILL.md frontmatter/content missing: ${field}`);
}
if (skill.includes("compatibility: opencode")) errors.push("Core skill must not be locked to OpenCode.");
if (!skill.includes("references/accessibility.md")) errors.push("Core skill does not advertise the accessibility reference.");
if (!skill.includes("validate-tokens.mjs")) errors.push("Core skill does not advertise token validation.");
if (!skill.includes("capture-screenshots.mjs")) errors.push("Core skill does not advertise screenshot capture.");

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
