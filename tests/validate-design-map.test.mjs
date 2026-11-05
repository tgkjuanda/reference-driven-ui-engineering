import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { validateDesignMap } from "../skills/ui-reference-replication/scripts/validate-design-map.mjs";

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ui-design-map-"));
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(path.join(root, "src/tokens.json"), '{"color.background":"#fff","space.4":"16px"}');
  await writeFile(path.join(root, "src/Button.tsx"), "export function Button() { return null; }");
  const map = {
    reference: { provider: "figma", fileUrl: "https://www.figma.com/design/file", fileKey: "file", pageId: "page", frameId: "frame", revision: "revision-1" },
    tokens: [{ figmaVariable: "Color/Background/Default", codeToken: "color.background", codeLocation: "src/tokens.json", status: "mapped", sourceConfidence: "high" }],
    components: [{ figmaComponent: "Button/Primary", codeComponent: "Button", codeLocation: "src/Button.tsx", codeConnect: "not-configured", variants: ["primary"], status: "mapped" }],
    drift: { missingCodeTokens: [], changedFigmaValues: [], unmappedComponents: [], missingCodeVariants: [], visualDifferences: [] }
  };
  return { root, map };
}
test("complete Figma-to-code map passes when code references exist", async () => {
  const { root, map } = await fixture();
  try { const result = await validateDesignMap(map, root); assert.equal(result.status, "pass"); assert.equal(result.summary.tokenMappings, 1); assert.equal(result.summary.componentMappings, 1); }
  finally { await rm(root, { recursive: true, force: true }); }
});
test("unmapped records and drift remain partial", async () => {
  const { root, map } = await fixture();
  try { map.tokens[0].status = "unmapped"; map.drift.missingCodeTokens.push("Color/Background/Default"); const result = await validateDesignMap(map, root); assert.equal(result.status, "partial"); assert.equal(result.summary.partialMappings, 1); }
  finally { await rm(root, { recursive: true, force: true }); }
});
test("mapped token absent from its code file fails", async () => {
  const { root, map } = await fixture();
  try { map.tokens[0].codeToken = "color.missing"; const result = await validateDesignMap(map, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("not found"))); }
  finally { await rm(root, { recursive: true, force: true }); }
});
test("missing code locations fail", async () => {
  const { root, map } = await fixture();
  try { map.components[0].codeLocation = "src/missing.tsx"; const result = await validateDesignMap(map, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("ENOENT"))); }
  finally { await rm(root, { recursive: true, force: true }); }
});
test("code path traversal is rejected", async () => {
  const { root, map } = await fixture();
  try { map.tokens[0].codeLocation = "../outside.json"; const result = await validateDesignMap(map, root); assert.equal(result.status, "fail"); assert.ok(result.errors.some(item => item.includes("escapes"))); }
  finally { await rm(root, { recursive: true, force: true }); }
});
