import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "skills/ui-reference-replication/scripts/validate-visual-evidence.mjs");

function png(width, height) {
  const buffer = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(buffer, 0);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

async function setup() {
  const rootDir = await mkdtemp(path.join(tmpdir(), "ui-evidence-"));
  const evidenceDir = path.join(rootDir, "evidence");
  await mkdir(evidenceDir);
  await writeFile(path.join(evidenceDir, "reference.png"), png(1440, 900));
  await writeFile(path.join(evidenceDir, "actual.png"), png(1440, 900));
  return { rootDir };
}

function baseManifest() {
  return {
    schemaVersion: "1.0.0",
    task: { id: "test-1", workMode: "new-build", fidelity: "reference-faithful" },
    captures: [{
      id: "home-desktop",
      route: "/",
      state: "default",
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
      reference: { path: "evidence/reference.png", source: "fixture reference" },
      implementation: { path: "evidence/actual.png" },
      visualReview: {
        status: "reviewed",
        attestation: "agent-declared",
        reviewer: "test-vision-agent",
        reviewedAt: "2026-11-05T10:00:00.000Z",
        inspectedReference: true,
        inspectedImplementation: true,
        summary: "Both screenshots were inspected directly at matching dimensions.",
        findings: []
      }
    }]
  };
}

async function run(rootDir, manifest) {
  const file = path.join(rootDir, "evidence.json");
  await writeFile(file, JSON.stringify(manifest, null, 2));
  return spawnSync(process.execPath, [script, "--root", rootDir, "--file", "evidence.json"], {
    cwd: rootDir,
    encoding: "utf8"
  });
}

test("valid reviewed evidence produces matching dimensions and hashes", async () => {
  const { rootDir } = await setup();
  try {
    const result = await run(rootDir, baseManifest());
    const report = JSON.parse(result.stdout);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(report.status, "pass");
    assert.equal(report.checkedCaptureCount, 1);
    assert.equal(report.captures[0].reference.dimensions.width, 1440);
    assert.equal(report.captures[0].implementation.sha256.length, 64);
    assert.match(report.warnings[0], /agent-declared/);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("dimension mismatch fails the visual evidence gate", async () => {
  const { rootDir } = await setup();
  try {
    await writeFile(path.join(rootDir, "evidence", "actual.png"), png(1280, 720));
    const result = await run(rootDir, baseManifest());
    const report = JSON.parse(result.stdout);
    assert.equal(result.status, 1);
    assert.ok(report.errors.some(item => item.message.includes("dimensions must match")));
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("unreviewed or incomplete inspection cannot pass", async () => {
  const { rootDir } = await setup();
  try {
    const manifest = baseManifest();
    manifest.captures[0].visualReview.status = "not-reviewed";
    manifest.captures[0].visualReview.inspectedReference = false;
    const result = await run(rootDir, manifest);
    const report = JSON.parse(result.stdout);
    assert.equal(result.status, 1);
    assert.ok(report.errors.some(item => item.message.includes("must be reviewed")));
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("paths outside the evidence root are rejected", async () => {
  const { rootDir } = await setup();
  try {
    const manifest = baseManifest();
    manifest.captures[0].reference.path = "../outside.png";
    const result = await run(rootDir, manifest);
    const report = JSON.parse(result.stdout);
    assert.equal(result.status, 1);
    assert.ok(report.errors.some(item => item.message.includes("escapes the evidence root")));
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
