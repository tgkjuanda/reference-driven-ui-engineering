import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, symlink, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { resolveWithinProject as resolveScreenshotPath } from "../skills/ui-reference-replication/scripts/capture-screenshots.mjs";
import { resolveWithinProject as resolveAccessibilityPath } from "../skills/ui-reference-replication/scripts/accessibility-audit.mjs";
import { resolveWithinProject as resolveTokenPath } from "../skills/ui-reference-replication/scripts/validate-tokens.mjs";

test("helper file paths cannot escape the target project directory", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "reference-skill-project-"));
  const external = await mkdtemp(path.join(os.tmpdir(), "reference-skill-external-"));
  try {
    for (const resolver of [resolveScreenshotPath, resolveAccessibilityPath, resolveTokenPath]) {
      await assert.rejects(resolver(project, "../outside.txt"), /inside the .*project directory/);
    }
    await symlink(external, path.join(project, "external-link"), "dir");
    for (const resolver of [resolveScreenshotPath, resolveAccessibilityPath]) {
      await assert.rejects(resolver(project, "external-link/output.json"), /symlink outside/);
    }
    await assert.rejects(resolveTokenPath(project, "external-link/secret.json"), /symlink outside/);
  } finally {
    await rm(project, { recursive: true, force: true });
    await rm(external, { recursive: true, force: true });
  }
});

test("project inspection refuses an output path outside the selected project root", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "reference-skill-inspect-"));
  try {
    const script = fileURLToPath(new URL("../skills/ui-reference-replication/scripts/inspect-project.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [script, "--root", project, "--output", "../escape.json"], {
      cwd: project,
      encoding: "utf8"
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /inside the project directory/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
