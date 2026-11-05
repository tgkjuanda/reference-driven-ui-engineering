import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(root, "skills/ui-reference-replication");
const script = path.join(skillRoot, "scripts/plan-task.mjs");

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
    "--figma", "--motion", "--accessibility", "--responsive",
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

test("planner emits direct bundled script commands without npm run aliases", () => {
  const result = run([
    "--work-mode", "existing-redesign",
    "--scope", "functional",
    "--figma", "--benchmark", "--agent-compatibility",
    "--json"
  ]);
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(result.stdout);
  assert.equal(plan.suggestedChecks.some(item => item.includes("npm run")), false);
  assert.ok(plan.suggestedChecks.some(item => item.includes("benchmark.mjs") && item.includes(" validate ")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("benchmark.mjs") && item.includes(" compare ")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("validate-agent-compatibility.mjs")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("run-functional-regression.mjs")));
  assert.ok(plan.suggestedChecks.some(item => item.includes("compare-regression.mjs")));
});

test("packaged consumer documentation uses relocatable script paths", async () => {
  const readme = await (await import("node:fs/promises")).readFile(path.join(skillRoot, "scripts/README.md"), "utf8");
  const consumerSection = readme.split("## Token-efficient task plan")[1];
  assert.ok(consumerSection, "consumer-project instructions must be present");
  assert.doesNotMatch(consumerSection, /npm run/);
  assert.doesNotMatch(consumerSection, /skills\/ui-reference-replication\//);
  assert.match(readme, /Repository-maintainer checks \(source checkout only\)/);

  const evidenceGuide = await (await import("node:fs/promises")).readFile(
    path.join(skillRoot, "references/evidence-and-visual-qa.md"),
    "utf8"
  );
  assert.match(evidenceGuide, /node "\$SKILL_DIR\/scripts\/validate-visual-evidence\.mjs"/);
  assert.doesNotMatch(evidenceGuide, /node\s+skills\/ui-reference-replication\/scripts\//);
});

test("full Skill package runs after relocation into a consumer project", async () => {
  const consumerRoot = await mkdtemp(path.join(os.tmpdir(), "installed-skill-"));
  const installedSkillDir = path.join(consumerRoot, ".agents", "skills", "ui-reference-replication");
  const installedScript = path.join(installedSkillDir, "scripts/plan-task.mjs");
  try {
    await mkdir(path.dirname(installedSkillDir), { recursive: true });
    await cp(skillRoot, installedSkillDir, { recursive: true });

    const result = spawnSync(process.execPath, [
      installedScript,
      "--work-mode", "existing-redesign",
      "--scope", "functional",
      "--figma", "--benchmark", "--agent-compatibility",
      "--json"
    ], { cwd: consumerRoot, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const plan = JSON.parse(result.stdout);
    const installedRoot = ".agents/skills/ui-reference-replication";

    for (const relative of [...plan.readBeforeImplementation, ...plan.loadOnlyWhenNeeded]) {
      await access(path.join(consumerRoot, relative));
    }
    for (const filename of ["benchmark.mjs", "validate-design-map.mjs", "validate-agent-compatibility.mjs"]) {
      await access(path.join(installedSkillDir, "scripts", filename));
    }
    assert.ok(plan.suggestedChecks.some(item => item.includes('node "' + installedRoot + '/scripts/benchmark.mjs" validate')));
    assert.ok(plan.suggestedChecks.some(item => item.includes('node "' + installedRoot + '/scripts/validate-design-map.mjs"')));
    assert.ok(plan.suggestedChecks.every(item => !item.includes("npm run")));

    await mkdir(path.join(consumerRoot, "src"), { recursive: true });
    await writeFile(path.join(consumerRoot, "src/app.css"), ":root { --brand-color: #123456; }\\n");
    const map = {
      reference: {
        provider: "figma",
        fileUrl: "https://www.figma.com/file/example",
        fileKey: "example",
        pageId: "page-1",
        frameId: "frame-1",
        revision: "revision-1"
      },
      tokens: [{
        figmaVariable: "color/brand",
        codeToken: "--brand-color",
        codeLocation: "src/app.css",
        status: "mapped",
        sourceConfidence: "high"
      }],
      components: [],
      drift: {
        missingCodeTokens: [],
        changedFigmaValues: [],
        unmappedComponents: [],
        missingCodeVariants: [],
        visualDifferences: []
      }
    };
    await writeFile(path.join(consumerRoot, "design-map.json"), JSON.stringify(map));
    const validation = spawnSync(process.execPath, [
      path.join(installedSkillDir, "scripts/validate-design-map.mjs"),
      "--file", "design-map.json",
      "--root", "."
    ], { cwd: consumerRoot, encoding: "utf8" });
    assert.equal(validation.status, 0, validation.stderr);
    assert.equal(JSON.parse(validation.stdout).status, "pass");
  } finally {
    await rm(consumerRoot, { recursive: true, force: true });
  }
});
