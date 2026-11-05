#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const KNOWN_TYPES = new Set([
  "color", "dimension", "fontFamily", "fontWeight", "duration",
  "cubicBezier", "number", "strokeStyle", "border", "transition",
  "shadow", "gradient", "typography"
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function addIssue(target, code, message, token = "") {
  target.push({ code, token, message });
}
function validateValue(type, value, token, errors, warnings) {
  if (value === undefined || value === null) {
    addIssue(errors, "missing-value", "Token value is missing or null.", token);
    return;
  }
  if (!type) {
    addIssue(warnings, "missing-type", "No $type is defined on the token or inherited group.", token);
    return;
  }
  if (!KNOWN_TYPES.has(type)) {
    addIssue(warnings, "unknown-type", `Type "${type}" is not in the validator's known DTCG type list; review custom type usage.`, token);
    return;
  }
  switch (type) {
    case "color":
      if (!(typeof value === "string" && value.trim()) && !isObject(value)) {
        addIssue(errors, "invalid-color", "Color value must be a non-empty string or structured color object.", token);
      }
      break;
    case "dimension":
      if (!(typeof value === "string" && (/^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|pt|pc|cm|mm|in)$/i.test(value.trim()) || value.trim() === "0"))) {
        addIssue(errors, "invalid-dimension", "Dimension must be a number with a supported unit (or unitless zero).", token);
      }
      break;
    case "duration":
      if (!(typeof value === "string" && /^\d+(?:\.\d+)?(?:ms|s)$/.test(value.trim()))) {
        addIssue(errors, "invalid-duration", "Duration must use ms or s units.", token);
      }
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        addIssue(errors, "invalid-number", "Number token must have a finite numeric value.", token);
      }
      break;
    case "fontFamily":
      if (!(typeof value === "string" && value.trim()) && !(Array.isArray(value) && value.length && value.every(x => typeof x === "string" && x.trim()))) {
        addIssue(errors, "invalid-font-family", "fontFamily must be a non-empty string or array of strings.", token);
      }
      break;
    case "fontWeight":
      if (!((typeof value === "number" && Number.isFinite(value)) || (typeof value === "string" && value.trim()))) {
        addIssue(errors, "invalid-font-weight", "fontWeight must be a number or non-empty string.", token);
      }
      break;
    case "typography":
      if (!isObject(value)) {
        addIssue(errors, "invalid-typography", "Typography composite value must be an object.", token);
      } else {
        for (const key of ["fontFamily", "fontSize", "fontWeight", "lineHeight"]) {
          if (!(key in value)) addIssue(warnings, "incomplete-typography", `Typography token is missing "${key}".`, token);
        }
      }
      break;
    default:
      if (type === "cubicBezier" && !(Array.isArray(value) && value.length === 4 && value.every(Number.isFinite))) {
        addIssue(errors, "invalid-cubic-bezier", "cubicBezier must be an array of four finite numbers.", token);
      }
      break;
  }
}
function findAliases(value, owner, aliases) {
  if (typeof value === "string") {
    const exact = value.match(/^\\{([^{}]+)\\}$/);
    if (exact) aliases.push({ owner, reference: exact[1] });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(item => findAliases(item, owner, aliases));
    return;
  }
  if (isObject(value)) {
    for (const child of Object.values(value)) findAliases(child, owner, aliases);
  }
}

export function validateTokenDocument(document) {
  const errors = [];
  const warnings = [];
  const tokens = new Map();
  const aliases = [];
  function visit(node, parts = [], inheritedType = undefined) {
    if (!isObject(node)) {
      addIssue(errors, "invalid-node", "Groups and token definitions must be JSON objects.", parts.join("."));
      return;
    }
    const ownType = typeof node.$type === "string" ? node.$type : undefined;
    const effectiveType = ownType ?? inheritedType;
    if (ownType && !KNOWN_TYPES.has(ownType)) {
      addIssue(warnings, "unknown-type", `Type "${ownType}" is not in the validator's known DTCG type list.`, parts.join("."));
    }
    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      const childKeys = Object.keys(node).filter(key => !key.startsWith("$"));
      if (childKeys.length) addIssue(errors, "token-and-group-mixed", "A token cannot also contain child token/group properties.", parts.join("."));
      const name = parts.join(".");
      tokens.set(name, { value: node.$value, type: effectiveType });
      validateValue(effectiveType, node.$value, name, errors, warnings);
      findAliases(node.$value, name, aliases);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      visit(child, [...parts, key], effectiveType);
    }
  }
  if (!isObject(document)) {
    addIssue(errors, "invalid-root", "Token document root must be a JSON object.");
    return { valid: false, errors, warnings, tokenCount: 0, aliasCount: 0 };
  }
  visit(document);
  for (const alias of aliases) {
    if (!tokens.has(alias.reference)) {
      addIssue(errors, "unresolved-alias", `Alias references missing token "{${alias.reference}}".`, alias.owner);
    }
  }
  const graph = new Map();
  for (const alias of aliases) {
    if (!graph.has(alias.owner)) graph.set(alias.owner, []);
    graph.get(alias.owner).push(alias.reference);
  }
  const visiting = new Set();
  const visited = new Set();
  function detectCycle(name, chain = []) {
    if (visiting.has(name)) {
      addIssue(errors, "circular-alias", `Circular alias detected: ${[...chain, name].join(" -> ")}.`, name);
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const next of graph.get(name) ?? []) {
      if (tokens.has(next)) detectCycle(next, [...chain, name]);
    }
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of graph.keys()) detectCycle(name);
  return { valid: errors.length === 0, errors, warnings, tokenCount: tokens.size, aliasCount: aliases.length };
}

async function main() {
  const file = process.argv[2];
  if (!file || file.startsWith("--")) {
    console.error("Usage: node validate-tokens.mjs <design-tokens.json>");
    process.exitCode = 2;
    return;
  }
  let document;
  try { document = JSON.parse(await readFile(path.resolve(file), "utf8")); }
  catch (error) {
    console.error(JSON.stringify({ valid: false, errors: [{ code: "read-or-parse-error", message: error.message }], warnings: [] }, null, 2));
    process.exitCode = 2;
    return;
  }
  const result = validateTokenDocument(document);
  console.log(JSON.stringify({ file: path.resolve(file), ...result }, null, 2));
  if (!result.valid) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
