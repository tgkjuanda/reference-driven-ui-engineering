import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const skillPath = new URL("../skills/ui-reference-replication/SKILL.md", import.meta.url);
const rulePath = new URL("../.agents/rules/ui-reference-replication.md", import.meta.url);

test("Skill description advertises reference-led UI activation triggers", async () => {
  const skill = await readFile(skillPath, "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontmatter, "SKILL.md YAML frontmatter must exist");
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
  for (const keyword of ["screenshots", "reference images", "mockups", "wireframes", "by default"]) {
    assert.ok(description.toLowerCase().includes(keyword.toLowerCase()), "missing discovery keyword: " + keyword);
  }
});

test("Antigravity always-on rule routes visual-reference UI tasks to the Skill", async () => {
  const rule = await readFile(rulePath, "utf8");
  assert.match(rule, /^---\ntrigger: always_on\n/);
  assert.match(rule, /reference-led web\/app UI implementation/);
  assert.match(rule, /without requiring the user to mention the Skill/);
  assert.match(rule, /visual-capability gate as mandatory/);
  assert.match(rule, /Do not invoke it for backend-only work/);
});
