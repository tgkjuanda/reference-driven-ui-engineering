import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const skillPath = new URL("../skills/ui-reference-replication/SKILL.md", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);

test("Community Edition operates only in Reference-Faithful mode", async () => {
  const skill = await readFile(skillPath, "utf8");
  const readme = await readFile(readmePath, "utf8");
  assert.match(skill, /Community Edition has one fidelity target: \*\*Reference-Faithful\*\*/);
  assert.match(readme, /One fidelity target: Reference-Faithful/);
  assert.doesNotMatch(skill, /##\s+Fidelity modes|choose Reference-Inspired Creative|Use Reference-Inspired Creative/i);
  assert.doesNotMatch(skill, /references\/creative-reference-mode\.md|references\/anti-ai-slop\.md/);
});

test("README distinguishes Community and Premium editions without exposing private checkout/source", async () => {
  const readme = await readFile(readmePath, "utf8");
  assert.match(readme, /Two editions: Community and Premium/);
  assert.match(readme, /Agensi\.io/);
  assert.match(readme, /Reference-Inspired Creative/);
  assert.doesNotMatch(readme, /reference-driven-ui-engineering-premium/);
  assert.doesNotMatch(readme, /gumroad|lemon squeezy|stripe payment link/i);
});

test("premium-only modules are absent from the current Community Edition tree", async () => {
  const excluded = [
    "skills/ui-reference-replication/references/creative-reference-mode.md",
    "skills/ui-reference-replication/references/anti-ai-slop.md",
    "skills/ui-reference-replication/references/design-intelligence.md",
    "skills/ui-reference-replication/references/motion-design.md",
    "skills/ui-reference-replication/references/benchmark-protocol.md",
    "skills/ui-reference-replication/scripts/plan-task.mjs",
    "skills/ui-reference-replication/scripts/benchmark.mjs",
    "skills/ui-reference-replication/scripts/validate-quality-report.mjs",
    "skills/ui-reference-replication/templates/quality-report.example.json"
  ];
  for (const relative of excluded) {
    await assert.rejects(access(new URL(relative, root)), { code: "ENOENT" }, relative + " should not be shipped in Community Edition");
  }
});
