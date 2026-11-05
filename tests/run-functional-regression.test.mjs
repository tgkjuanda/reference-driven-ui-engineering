import test from "node:test";
import assert from "node:assert/strict";
import { validateConfig } from "../skills/ui-reference-replication/scripts/run-functional-regression.mjs";

const valid = {
  schemaVersion: "1.0.0",
  baseUrl: "http://localhost:3000",
  checks: [{
    id: "home",
    route: "/",
    expectedStatus: 200,
    steps: [{ action: "expect-visible", selector: "main" }]
  }]
};

test("accepts a declared route and safe interaction plan", () => {
  assert.deepEqual(validateConfig(valid), []);
});

test("rejects missing identifiers, duplicate ids, and invalid routes", () => {
  const config = structuredClone(valid);
  config.checks.push({ id: "home", route: "dashboard" });
  const errors = validateConfig(config);
  assert.ok(errors.some(item => item.includes("Duplicate check id")));
  assert.ok(errors.some(item => item.includes('route must start with "/"')));
});

test("rejects unsupported or incomplete interaction steps", () => {
  const config = structuredClone(valid);
  config.checks[0].steps = [
    { action: "run-javascript", code: "alert(1)" },
    { action: "fill", selector: "input[name=email]" }
  ];
  const errors = validateConfig(config);
  assert.ok(errors.some(item => item.includes("unsupported action")));
  assert.ok(errors.some(item => item.includes("requires value")));
});

test("requires a real http or https base URL and an explicit checks array", () => {
  assert.ok(validateConfig({ schemaVersion: "1.0.0", baseUrl: "localhost", checks: [] }).length >= 2);
});
