import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const skillPath = new URL("../skills/ui-reference-replication/SKILL.md", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);

test("Community Edition exposes Reference-Faithful as its only fidelity target", async () => {
  const skill = await readFile(skillPath, "utf8");
  const readme = await readFile(readmePath, "utf8");
  assert.match(skill, /Reference-Faithful/);
  assert.match(readme, /Reference-Faithful/);
  assert.doesNotMatch(skill, /Reference-Inspired Creative|creative-reference-mode|anti-ai-slop/i);
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
