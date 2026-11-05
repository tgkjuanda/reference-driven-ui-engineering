import test from "node:test";
import assert from "node:assert/strict";
import { validateTokenDocument } from "../skills/ui-reference-replication/scripts/validate-tokens.mjs";

test("accepts inherited DTCG group types and valid values", () => {
  const result = validateTokenDocument({
    color: { $type: "color", primary: { $value: "#3157D5" } },
    spacing: { $type: "dimension", medium: { $value: "16px" } },
    typography: {
      body: {
        $type: "typography",
        $value: {
          fontFamily: ["Inter", "Arial"],
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px"
        }
      }
    }
  });
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.tokenCount, 3);
});

test("resolves token aliases within the document", () => {
  const result = validateTokenDocument({
    color: {
      $type: "color",
      primary: { $value: "#3157D5" },
      action: { $value: "{color.primary}" }
    }
  });
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.aliasCount, 1);
});

test("rejects unresolved aliases", () => {
  const result = validateTokenDocument({
    color: { $type: "color", action: { $value: "{color.missing}" } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "unresolved-alias"));
});

test("rejects invalid dimension values", () => {
  const result = validateTokenDocument({
    spacing: { $type: "dimension", medium: { $value: "sixteen" } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "invalid-dimension"));
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

test("rejects an object that mixes token value and child groups", () => {
  const result = validateTokenDocument({
    color: { $type: "color", $value: "#fff", child: { $value: "#000" } }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(issue => issue.code === "token-and-group-mixed"));
});
