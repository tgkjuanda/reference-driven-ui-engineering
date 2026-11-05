import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePerformanceMetrics, validatePerformanceConfig, DEFAULT_BUDGETS } from "../skills/ui-reference-replication/scripts/performance-audit.mjs";

test("accepts a valid performance budget configuration", () => {
  assert.deepEqual(validatePerformanceConfig({
    schemaVersion: "1.0.0", baseUrl: "http://localhost:3000",
    routes: [{ path: "/", budgets: DEFAULT_BUDGETS }]
  }), []);
});

test("fails metrics that exceed configured budgets", () => {
  const result = evaluatePerformanceMetrics({ fcpMs: 2200, lcpMs: 2800, cls: 0.02, domNodes: 100, resourceCount: 20, transferBytes: 500000 });
  assert.equal(result.status, "fail");
  assert.ok(result.checks.some(item => item.metric === "lcpMs" && item.status === "fail"));
});

test("partial result is distinct when a metric cannot be measured", () => {
  const result = evaluatePerformanceMetrics({ fcpMs: 1000, lcpMs: null, cls: 0.01, domNodes: 100, resourceCount: 20, transferBytes: 500000 });
  assert.equal(result.status, "partial");
  assert.ok(result.checks.some(item => item.status === "not-measurable"));
});

test("rejects negative performance budgets", () => {
  const errors = validatePerformanceConfig({
    schemaVersion: "1.0.0", baseUrl: "http://localhost:3000",
    routes: [{ path: "/", budgets: { lcpMs: -1 } }]
  });
  assert.ok(errors.some(item => item.includes("non-negative")));
});
