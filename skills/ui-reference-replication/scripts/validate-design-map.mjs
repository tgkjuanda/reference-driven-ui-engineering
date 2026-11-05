#!/usr/bin/env node
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const STATUSES = new Set(["mapped", "partial", "unmapped"]);
const DRIFT_FIELDS = ["missingCodeTokens", "changedFigmaValues", "unmappedComponents", "missingCodeVariants", "visualDifferences"];

async function resolveProjectFile(root, relative) {
  if (typeof relative !== "string" || !relative.trim() || path.isAbsolute(relative)) throw new Error("Code locations must be non-empty relative paths.");
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Code location escapes the project root: " + relative);
  const resolved = await realpath(target);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error("Code location escapes the project root through a symlink: " + relative);
  if (!(await stat(resolved)).isFile()) throw new Error("Code location is not a file: " + relative);
  return resolved;
}

export async function validateDesignMap(document, root = process.cwd()) {
  const errors = [], warnings = [], checked = { tokens: [], components: [] };
  const projectRoot = await realpath(root);
  const reference = document && document.reference;
  if (!reference || reference.provider !== "figma") errors.push("reference.provider must be figma.");
  for (const field of ["fileUrl", "fileKey", "pageId", "frameId", "revision"]) {
    if (typeof (reference && reference[field]) !== "string" || !reference[field].trim()) errors.push("reference." + field + " is required.");
  }
  if (!Array.isArray(document && document.tokens)) errors.push("tokens must be an array.");
  if (!Array.isArray(document && document.components)) errors.push("components must be an array.");
  if (!document || !document.drift || typeof document.drift !== "object") errors.push("drift object is required.");
  for (const field of DRIFT_FIELDS) if (!Array.isArray(document && document.drift && document.drift[field])) errors.push("drift." + field + " must be an array.");
  if (!Array.isArray(document && document.tokens) || !Array.isArray(document && document.components)) {
    return { schemaVersion: "1.0.0", status: "fail", errors, warnings, checked, summary: null };
  }

  const tokenNames = new Set();
  for (const [index, item] of document.tokens.entries()) {
    const label = "tokens[" + index + "]";
    if (!item || typeof item.figmaVariable !== "string" || !item.figmaVariable.trim()) { errors.push(label + ": figmaVariable is required."); continue; }
    if (tokenNames.has(item.figmaVariable)) errors.push(label + ": duplicate Figma variable " + item.figmaVariable + ".");
    tokenNames.add(item.figmaVariable);
    if (typeof item.codeToken !== "string" || !item.codeToken.trim()) errors.push(label + ": codeToken is required.");
    if (!STATUSES.has(item.status)) errors.push(label + ": status must be mapped, partial, or unmapped.");
    if (!["high", "medium", "low"].includes(item.sourceConfidence)) errors.push(label + ": sourceConfidence must be high, medium, or low.");
    try {
      const file = await resolveProjectFile(projectRoot, item.codeLocation);
      const source = await readFile(file, "utf8");
      const found = typeof item.codeToken === "string" && source.includes(item.codeToken);
      if (item.status === "mapped" && !found) errors.push(label + ": mapped codeToken was not found in " + item.codeLocation + ".");
      if (item.status !== "mapped" || !found) warnings.push(label + ": mapping needs review.");
      checked.tokens.push({ figmaVariable: item.figmaVariable, codeToken: item.codeToken ?? null, codeLocation: item.codeLocation, status: item.status, codeTokenFound: found });
    } catch (error) { errors.push(label + ": " + error.message); }
  }

  const componentNames = new Set();
  for (const [index, item] of document.components.entries()) {
    const label = "components[" + index + "]";
    if (!item || typeof item.figmaComponent !== "string" || !item.figmaComponent.trim()) { errors.push(label + ": figmaComponent is required."); continue; }
    if (componentNames.has(item.figmaComponent)) errors.push(label + ": duplicate Figma component " + item.figmaComponent + ".");
    componentNames.add(item.figmaComponent);
    if (typeof item.codeComponent !== "string" || !item.codeComponent.trim()) errors.push(label + ": codeComponent is required.");
    if (!STATUSES.has(item.status)) errors.push(label + ": status must be mapped, partial, or unmapped.");
    if (!Array.isArray(item.variants)) errors.push(label + ": variants must be an array.");
    try {
      const file = await resolveProjectFile(projectRoot, item.codeLocation);
      const source = await readFile(file, "utf8");
      const found = typeof item.codeComponent === "string" && source.includes(item.codeComponent);
      if (item.status === "mapped" && !found) errors.push(label + ": mapped codeComponent was not found in " + item.codeLocation + ".");
      if (item.status !== "mapped" || !found) warnings.push(label + ": component mapping needs review.");
      checked.components.push({ figmaComponent: item.figmaComponent, codeComponent: item.codeComponent ?? null, codeLocation: item.codeLocation, variants: item.variants ?? [], status: item.status, codeComponentFound: found });
    } catch (error) { errors.push(label + ": " + error.message); }
  }

  const driftCounts = Object.fromEntries(DRIFT_FIELDS.map(field => [field, Array.isArray(document.drift[field]) ? document.drift[field].length : 0]));
  const partialMappings = [...checked.tokens, ...checked.components].filter(item => item.status !== "mapped" || (item.codeTokenFound === false) || (item.codeComponentFound === false)).length;
  const hasDrift = Object.values(driftCounts).some(count => count > 0);
  const status = errors.length ? "fail" : partialMappings || hasDrift ? "partial" : "pass";
  return {
    schemaVersion: "1.0.0", status, errors, warnings, reference: { fileKey: reference.fileKey, pageId: reference.pageId, frameId: reference.frameId, revision: reference.revision },
    summary: { tokenMappings: checked.tokens.length, componentMappings: checked.components.length, partialMappings, drift: driftCounts },
    checked, limitation: "This validator checks declared mapping strings and project file presence. It does not call Figma, verify live variable values, inspect rendered pixels, or prove Code Connect synchronization."
  };
}

async function main() {
  const args = process.argv.slice(2), get = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node validate-design-map.mjs --file <figma-code-map.json> [--root .]"); return; }
  const file = get("--file");
  if (!file) throw new Error("Required: --file <figma-code-map.json>.");
  if (path.isAbsolute(file)) throw new Error("Map path must be relative to --root.");
  const root = path.resolve(get("--root") ?? "."), target = path.resolve(root, file);
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Map path escapes --root.");
  const realRoot = await realpath(root), realTarget = await realpath(target);
  if (realTarget !== realRoot && !realTarget.startsWith(realRoot + path.sep)) throw new Error("Map path escapes --root through a symlink.");
  const document = JSON.parse(await readFile(realTarget, "utf8"));
  const report = await validateDesignMap(document, realRoot);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 2; });
