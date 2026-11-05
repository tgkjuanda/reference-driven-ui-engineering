import test from "node:test";
import assert from "node:assert/strict";
import { validateTokenDocument } from "../skills/ui-reference-replication/scripts/validate-tokens.mjs";

test("accepts DTCG 2025.10 structured values and aliases", () => {
  const result = validateTokenDocument({
    color: {
      $type: "color",
      primary: { $value: { colorSpace: "srgb", components: [0.19, 0.34, 0.83], hex: "#3157D5" } }
    },
    spacing: { $type: "dimension", medium: { $value: { value: 16, unit: "px" } } },
    typography: {
      family: { $type: "fontFamily", $value: ["Inter", "Arial"] },
      weight: { $type: "fontWeight", $value: 400 },
      body: {
        $type: "typography",
        $value: {
          fontFamily: "{typography.family}",
          fontSize: { value: 14, unit: "px" },
          fontWeight: "{typography.weight}",
          lineHeight: 1.4286
        }
      }
    }
  });
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.tokenCount, 5);
  assert.equal(result.aliasCount, 2);
});

test("rejects unresolved aliases", () => {
  const result = validateTokenDocument({
    color: { $type: "color", action: { $value: "{color.missing}" } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "unresolved-alias"));
});

test("rejects string dimensions from legacy token syntax", () => {
  const result = validateTokenDocument({
    spacing: { $type: "dimension", medium: { $value: "16px" } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "invalid-dimension"));
});

test("rejects malformed DTCG color structures", () => {
  const result = validateTokenDocument({
    color: { $type: "color", primary: { $value: { colorSpace: "srgb", components: [1, 0] } } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "invalid-color"));
});

test("detects circular aliases", () => {
  const result = validateTokenDocument({
    color: {
      $type: "color",
      first: { $value: "{color.second}" },
      second: { $value: "{color.first}" }
    }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "circular-alias"));
});

test("rejects token objects that also contain child groups", () => {
  const result = validateTokenDocument({
    color: {
      $type: "color",
      $value: { colorSpace: "srgb", components: [1, 1, 1] },
      child: { $value: { colorSpace: "srgb", components: [0, 0, 0] } }
    }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "token-and-group-mixed"));
});
