import test from "node:test";
import assert from "node:assert/strict";
import { evaluateResponsiveMetrics, parseViewports } from "../skills/ui-reference-replication/scripts/run-responsive-audit.mjs";
test("responsive metrics pass without document overflow", () => { const result = evaluateResponsiveMetrics({ viewportWidth: 390, scrollWidth: 390, viewportMeta: true, pageErrors: [] }); assert.equal(result.status, "pass"); assert.equal(result.overflowPx, 0); });
test("responsive metrics fail on horizontal overflow", () => { const result = evaluateResponsiveMetrics({ viewportWidth: 390, scrollWidth: 450, viewportMeta: true, pageErrors: [] }); assert.equal(result.status, "fail"); assert.equal(result.overflowPx, 60); });
test("mobile viewport metadata is mandatory", () => { const result = evaluateResponsiveMetrics({ viewportWidth: 390, scrollWidth: 390, viewportMeta: false, pageErrors: [] }); assert.equal(result.status, "fail"); assert.match(result.errors.join(" "), /viewport meta/); });
test("desktop does not require mobile viewport metadata", () => assert.equal(evaluateResponsiveMetrics({ viewportWidth: 1440, scrollWidth: 1440, viewportMeta: false }).status, "pass"));
test("viewport parser validates syntax and limits", () => { assert.deepEqual(parseViewports("390x844,1440x900"), [{ width: 390, height: 844 }, { width: 1440, height: 900 }]); assert.throws(() => parseViewports("0x900"), /outside the supported range/); });
