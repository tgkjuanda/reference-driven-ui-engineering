import test from "node:test";
import assert from "node:assert/strict";
import { validateResponsiveConfig, evaluateResponsiveSnapshot } from "../skills/ui-reference-replication/scripts/responsive-audit.mjs";

test("accepts a valid route and viewport matrix", () => {
  assert.deepEqual(validateResponsiveConfig({
    schemaVersion: "1.0.0", baseUrl: "http://localhost:3000",
    routes: [{ path: "/", viewports: [{ width: 390, height: 844 }] }]
  }), []);
});

test("rejects missing viewport dimensions", () => {
  const errors = validateResponsiveConfig({
    schemaVersion: "1.0.0", baseUrl: "http://localhost:3000",
    routes: [{ path: "/", viewports: [{ width: 390 }] }]
  });
  assert.ok(errors.some(item => item.includes("positive integer width and height")));
});

test("detects document and element horizontal overflow", () => {
  assert.equal(evaluateResponsiveSnapshot({ viewportWidth: 390, documentScrollWidth: 420, bodyScrollWidth: 420, offenders: [] }).status, "fail");
  assert.equal(evaluateResponsiveSnapshot({ viewportWidth: 390, documentScrollWidth: 390, bodyScrollWidth: 390, offenders: [{ element: "div.wide" }] }).overflowCount, 1);
});

test("passes a clean viewport", () => {
  assert.equal(evaluateResponsiveSnapshot({ viewportWidth: 390, documentScrollWidth: 390, bodyScrollWidth: 390, offenders: [] }).status, "pass");
});
