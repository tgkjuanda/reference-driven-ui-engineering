import test from "node:test";
import assert from "node:assert/strict";
import { compareReports } from "../skills/ui-reference-replication/scripts/compare-regression.mjs";

const report = (label, checks) => ({ schemaVersion: "1.0.0", label, checks });

test("returns pass when all checks remain passing", () => {
  const result = compareReports(report("baseline", [{ id: "home", status: "pass" }]), report("post", [{ id: "home", status: "pass" }]));
  assert.equal(result.status, "pass");
  assert.deepEqual(result.summary.regressions, []);
});

test("detects a previously passing check that now fails", () => {
  const result = compareReports(
    report("baseline", [{ id: "save", status: "pass" }]),
    report("post", [{ id: "save", status: "fail", failures: ["Save button did not persist."] }])
  );
  assert.equal(result.status, "regressed");
  assert.equal(result.summary.regressions[0].id, "save");
});

test("reports pre-existing failures without mislabeling them as new regressions", () => {
  const result = compareReports(
    report("baseline", [{ id: "legacy", status: "fail" }]),
    report("post", [{ id: "legacy", status: "fail" }])
  );
  assert.equal(result.status, "no-new-regressions-with-existing-failures");
  assert.deepEqual(result.summary.preexistingFailures, ["legacy"]);
});

test("missing baseline coverage and failed new checks fail comparison", () => {
  const result = compareReports(
    report("baseline", [{ id: "home", status: "pass" }]),
    report("post", [{ id: "new-check", status: "fail" }])
  );
  assert.equal(result.status, "regressed");
  assert.deepEqual(result.summary.missingChecks, ["home"]);
  assert.equal(result.summary.newCheckFailures[0].id, "new-check");
});

test("rejects reports with missing schema", () => {
  const result = compareReports({}, report("post", []));
  assert.equal(result.status, "invalid");
});
