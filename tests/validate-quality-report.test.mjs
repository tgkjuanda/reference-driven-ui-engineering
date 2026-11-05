import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { validateQualityReport, requiredGates } from "../skills/ui-reference-replication/scripts/validate-quality-report.mjs";
const ids = ["visual-evidence","visual-review","functional-regression","responsive","accessibility","performance","dependency-security","design-system","existing-behavior"];
async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ui-quality-"));
  await mkdir(path.join(root, "reports"), { recursive: true });
  await writeFile(path.join(root, "reports/evidence.json"), "{}");
  return { root, report: { schemaVersion: "1.0.0", task: { id: "task-1", workMode: "existing-redesign", fidelity: "reference-faithful", motionInScope: false }, gates: ids.map(id => ({ id, status: "pass", summary: id + " passed with fixture evidence.", evidence: ["reports/evidence.json"] })) } };
}
test("required gates depend on mode and scope", () => { assert.ok(!requiredGates({ workMode: "new-build", fidelity: "reference-faithful", motionInScope: false }).includes("existing-behavior")); const gates = requiredGates({ workMode: "hybrid", fidelity: "reference-inspired-creative", motionInScope: true }); assert.ok(gates.includes("motion")); assert.ok(gates.includes("creative-originality")); assert.ok(gates.includes("existing-behavior")); });
test("complete evidence-backed report passes", async () => { const { root, report } = await fixture(); try { const result = await validateQualityReport(report, root); assert.equal(result.status, "pass"); assert.equal(result.summary.pass, ids.length); } finally { await rm(root, { recursive: true, force: true }); } });
test("missing required gate prevents pass", async () => { const { root, report } = await fixture(); try { report.gates = report.gates.filter(item => item.id !== "responsive"); const result = await validateQualityReport(report, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("responsive"))); } finally { await rm(root, { recursive: true, force: true }); } });
test("not-tested remains partial and requires a reason", async () => { const { root, report } = await fixture(); try { report.gates[0] = { id: "visual-evidence", status: "not-tested", summary: "Not run.", evidence: [], reason: "No screenshots were captured." }; const result = await validateQualityReport(report, root); assert.equal(result.status, "partial"); assert.equal(result.summary.notTested, 1); } finally { await rm(root, { recursive: true, force: true }); } });
test("path traversal and missing evidence fail", async () => { const { root, report } = await fixture(); try { report.gates[0].evidence = ["../outside.json"]; const result = await validateQualityReport(report, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("missing or escapes"))); } finally { await rm(root, { recursive: true, force: true }); } });
test("passing gates require evidence files", async () => { const { root, report } = await fixture(); try { report.gates[0].evidence = []; const result = await validateQualityReport(report, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("requires at least one existing evidence file"))); } finally { await rm(root, { recursive: true, force: true }); } });


for (const status of ["partial", "fail"]) {
  test(`${status} gates require at least one existing evidence file`, async () => {
    const { root, report } = await fixture();
    try {
      report.gates[0] = {
        id: "visual-evidence",
        status,
        summary: status + " result with a documented next action.",
        evidence: [],
        nextAction: "Capture and review the required evidence."
      };
      const result = await validateQualityReport(report, root);
      assert.equal(result.status, "fail");
      assert.ok(result.errors.some(item => item.includes("requires at least one existing evidence file")));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test(`${status} gates accept existing evidence with a next action`, async () => {
    const { root, report } = await fixture();
    try {
      report.gates[0] = {
        id: "visual-evidence",
        status,
        summary: status + " result supported by evidence.",
        evidence: ["reports/evidence.json"],
        nextAction: "Resolve the recorded outstanding issue."
      };
      const result = await validateQualityReport(report, root);
      assert.equal(result.status, status === "partial" ? "partial" : "fail");
      assert.equal(result.errors.some(item => item.includes("requires at least one existing evidence file")), false);
      assert.equal(result.summary[status], 1);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
