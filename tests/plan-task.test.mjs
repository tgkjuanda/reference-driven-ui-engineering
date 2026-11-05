import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "skills/ui-reference-replication/scripts/plan-task.mjs");

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

test("new build faithful plan loads only the mandatory visual gate before work", () => {
  const result = run(["--work-mode", "new-build", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(result.stdout);
  assert.deepEqual(plan.readBeforeImplementation, [
    "skills/ui-reference-replication/references/visual-capability-gate.md"
  ]);
  assert.ok(plan.loadOnlyWhenNeeded.includes("skills/ui-reference-replication/references/motion-design.md") === false);
  assert.ok(plan.costControls.some(item => item.includes("Do not load every reference")));
});

test("existing creative plan routes required guidance without duplicating references", () => {
  const result = run([
    "--work-mode", "existing-redesign",
    "--fidelity", "reference-inspired-creative",
    "--figma", "--motion", "--accessibility", "--responsive", "--performance", "--security",
    "--json"
  ]);
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(result.stdout);
  assert.ok(plan.readBeforeImplementation.includes("skills/ui-reference-replication/references/existing-ui-redesign.md"));
  assert.ok(plan.readBeforeImplementation.includes("skills/ui-reference-replication/references/creative-reference-mode.md"));
  assert.ok(plan.readBeforeImplementation.includes("skills/ui-reference-replication/references/anti-ai-slop.md"));
  assert.ok(plan.readBeforeImplementation.includes("skills/ui-reference-replication/references/figma-analysis.md"));
  assert.equal(new Set(plan.loadOnlyWhenNeeded).size, plan.loadOnlyWhenNeeded.length);
  assert.ok(plan.loadOnlyWhenNeeded.includes("skills/ui-reference-replication/references/motion-design.md"));
  assert.ok(plan.loadOnlyWhenNeeded.includes("skills/ui-reference-replication/references/accessibility.md"));
  assert.ok(plan.suggestedChecks.some(item => item.includes("accessibility-audit.mjs")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("validate-visual-evidence.mjs")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("audit:responsive")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("audit:performance")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("audit:security")));
  assert.ok(plan.loadOnlyWhenNeeded.includes("skills/ui-reference-replication/references/performance-security.md"));
});

test("planner rejects missing or invalid work mode", () => {
  const missing = run(["--json"]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /Required: --work-mode/);

  const invalid = run(["--work-mode", "unknown"]);
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /Invalid workMode/);
});

test("planner rejects unknown arguments and prints help", () => {
  const unknown = run(["--work-mode", "new-build", "--surprise"]);
  assert.equal(unknown.status, 2);
  assert.match(unknown.stderr, /Unknown argument/);

  const help = run(["--help"]);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Token-efficient task planner/);
});
