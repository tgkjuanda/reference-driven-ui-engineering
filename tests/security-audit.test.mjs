import test from "node:test";
import assert from "node:assert/strict";
import { scanSourceText, summarizeDependencyAudit } from "../skills/ui-reference-replication/scripts/security-audit.mjs";

test("flags risky HTML/eval APIs without returning source contents", () => {
  const findings = scanSourceText("src/example.js", 'element.innerHTML = userInput;\nconst value = eval(input);');
  assert.equal(findings.length, 2);
  assert.ok(findings.every(item => item.file === "src/example.js" && !("value" in item)));
});

test("detects common secret patterns while redacting values", () => {
  const findings = scanSourceText("src/config.js", 'const token = "ghp_abcdefghijklmnopqrstuvwxyz0123456789";');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].category, "github-token");
  assert.match(findings[0].message, /redacted/);
  assert.equal("value" in findings[0], false);
});

test("maps dependency audit severities to fail, partial, and pass", () => {
  assert.equal(summarizeDependencyAudit({ metadata: { vulnerabilities: { critical: 1, high: 0, moderate: 0, low: 0, total: 1 } } }).status, "fail");
  assert.equal(summarizeDependencyAudit({ metadata: { vulnerabilities: { critical: 0, high: 0, moderate: 1, low: 0, total: 1 } } }).status, "partial");
  assert.equal(summarizeDependencyAudit({ metadata: { vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, total: 0 } } }).status, "pass");
});
