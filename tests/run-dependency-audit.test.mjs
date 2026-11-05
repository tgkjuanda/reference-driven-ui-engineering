import test from "node:test";
import assert from "node:assert/strict";
import { summarizeNpmAudit } from "../skills/ui-reference-replication/scripts/run-dependency-audit.mjs";
test("dependency audit passes with no high or critical advisories", () => { const report = summarizeNpmAudit({ metadata: { vulnerabilities: { info: 0, low: 1, moderate: 2, high: 0, critical: 0, total: 3 } }, vulnerabilities: {} }); assert.equal(report.status, "pass"); assert.equal(report.total, 3); });
test("dependency audit fails at the configured threshold", () => { const report = summarizeNpmAudit({ metadata: { vulnerabilities: { high: 1, critical: 0, total: 1 } }, vulnerabilities: { "package-a": { severity: "high", isDirect: true } } }); assert.equal(report.status, "fail"); assert.equal(report.affectedPackages[0].name, "package-a"); });
test("dependency threshold can be set to moderate", () => { const audit = { metadata: { vulnerabilities: { moderate: 1, high: 0, critical: 0, total: 1 } }, vulnerabilities: {} }; assert.equal(summarizeNpmAudit(audit, "high").status, "pass"); assert.equal(summarizeNpmAudit(audit, "moderate").status, "fail"); });
test("invalid thresholds and malformed payloads are rejected", () => { assert.throws(() => summarizeNpmAudit({}, "urgent"), /failOn/); assert.throws(() => summarizeNpmAudit({ metadata: {} }), /metadata.vulnerabilities/); });
