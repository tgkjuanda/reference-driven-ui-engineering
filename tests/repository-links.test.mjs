import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const docs = [
  "../README.md",
  "../docs/AGENT-COMPATIBILITY.md",
  "../docs/LAUNCH-KIT.md"
];
const legacyRepository = "tgkjuanda/ui-reference-replication";
const canonicalRepository = "tgkjuanda/reference-driven-ui-engineering";

test("maintained installation and project links use the renamed repository", async () => {
  for (const relativePath of docs) {
    const content = await readFile(new URL(relativePath, import.meta.url), "utf8");
    assert.equal(content.includes(legacyRepository), false, relativePath + " contains a legacy repository reference");
    assert.ok(content.includes(canonicalRepository), relativePath + " should point to the current repository");
  }
});
