import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePerformanceMetrics } from "../skills/ui-reference-replication/scripts/run-performance-audit.mjs";
test("performance budgets pass when every configured metric is within limits", () => { const metrics = { timeToFirstByteMs: 300, firstContentfulPaintMs: 1000, largestContentfulPaintMs: 1900, cumulativeLayoutShift: 0.02, observedBlockingTimeMs: 80, transferBytes: 900000, javascriptBytes: 200000, cssBytes: 50000 }; const budgets = { timeToFirstByteMs: 800, firstContentfulPaintMs: 1800, largestContentfulPaintMs: 2500, cumulativeLayoutShift: 0.1, observedBlockingTimeMs: 200, transferBytes: 1500000, javascriptBytes: 500000, cssBytes: 250000 }; assert.equal(evaluatePerformanceMetrics(metrics, budgets).status, "pass"); });
test("a measured metric above budget fails", () => { const result = evaluatePerformanceMetrics({ firstContentfulPaintMs: 2500 }, { firstContentfulPaintMs: 1800 }); assert.equal(result.status, "fail"); assert.equal(result.summary.failed, 1); });
test("unavailable metrics remain partial", () => { const result = evaluatePerformanceMetrics({ firstContentfulPaintMs: null }, { firstContentfulPaintMs: 1800 }); assert.equal(result.status, "partial"); assert.equal(result.summary.notTested, 1); });
test("no configured budgets is not a pass", () => assert.equal(evaluatePerformanceMetrics({}, {}).status, "not-tested"));
test("unknown budget names are rejected", () => assert.equal(evaluatePerformanceMetrics({}, { arbitraryScore: 1 }).status, "fail"));
