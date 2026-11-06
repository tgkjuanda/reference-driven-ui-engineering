#!/usr/bin/env node
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const KNOWN_TYPES = new Set([
  "color", "dimension", "fontFamily", "fontWeight", "duration",
  "cubicBezier", "number", "strokeStyle", "border", "transition",
  "shadow", "gradient", "typography"
]);
const WEIGHT_KEYWORDS = new Set([
  "thin", "hairline", "extra-light", "ultra-light", "light", "normal",
  "regular", "book", "medium", "semi-bold", "demi-bold", "bold",
  "extra-bold", "ultra-bold", "black", "heavy", "extra-black", "ultra-black"
]);
const ALIAS_PATTERN = /^\{([^{}]+)\}$/;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
export async function resolveWithinProject(root, requested, label = "token file") {
  const base = await realpath(root);
  const candidate = path.resolve(base, requested);
  const relative = path.relative(base, candidate);
  if (relative.startsWith(".." + path.sep) || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(label + " must stay inside the current project directory.");
  }
  let probe = candidate;
  while (true) {
    try {
      const actual = await realpath(probe);
      const resolvedRelative = path.relative(base, actual);
      if (resolvedRelative.startsWith(".." + path.sep) || resolvedRelative === ".." || path.isAbsolute(resolvedRelative)) {
        throw new Error(label + " resolves through a symlink outside the current project directory.");
      }
      break;
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      const parent = path.dirname(probe);
      if (parent === probe) throw error;
      probe = parent;
    }
  }
  return candidate;
}
function isAlias(value) {
  return typeof value === "string" && ALIAS_PATTERN.test(value);
}
function addIssue(target, code, message, token = "") {
  target.push({ code, token, message });
}
function isDimension(value) {
  return isObject(value) &&
    typeof value.value === "number" &&
    Number.isFinite(value.value) &&
    ["px", "rem"].includes(value.unit);
}
function isFontWeight(value) {
  return (typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 1000) ||
    (typeof value === "string" && WEIGHT_KEYWORDS.has(value));
}
function validateValue(type, value, token, errors, warnings) {
  if (value === undefined || value === null) {
    addIssue(errors, "missing-value", "Token value is missing or null.", token);
    return;
  }
  if (isAlias(value)) return;
  if (!type) {
    addIssue(warnings, "missing-type", "No $type is defined on the token or inherited group.", token);
    return;
  }
  if (!KNOWN_TYPES.has(type)) {
    addIssue(warnings, "unknown-type", 'Type "' + type + '" is not in the validator known DTCG type list; review custom type usage.', token);
    return;
  }
  switch (type) {
    case "color": {
      const componentsValid = Array.isArray(value?.components) &&
        value.components.length >= 3 &&
        value.components.every(component =>
          (typeof component === "number" && Number.isFinite(component)) || component === "none"
        );
      const hexValid = value?.hex === undefined ||
        (typeof value.hex === "string" && /^#[0-9a-fA-F]{6}$/.test(value.hex));
      const alphaValid = value?.alpha === undefined ||
        (typeof value.alpha === "number" && Number.isFinite(value.alpha) && value.alpha >= 0 && value.alpha <= 1);
      if (!isObject(value) || typeof value.colorSpace !== "string" ||
          !value.colorSpace.trim() || !componentsValid || !hexValid || !alphaValid) {
        addIssue(errors, "invalid-color",
          "DTCG color requires colorSpace, at least three numeric/'none' components, optional alpha in [0,1], and optional six-digit hex fallback.", token);
      }
      break;
    }
    case "dimension":
      if (!isDimension(value)) {
        addIssue(errors, "invalid-dimension",
          'DTCG dimension must be { "value": finite number, "unit": "px" | "rem" }.', token);
      }
      break;
    case "duration":
      if (!isObject(value) || typeof value.value !== "number" ||
          !Number.isFinite(value.value) || !["ms", "s"].includes(value.unit)) {
        addIssue(errors, "invalid-duration",
          'DTCG duration must be { "value": finite number, "unit": "ms" | "s" }.', token);
      }
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        addIssue(errors, "invalid-number", "Number token must have a finite numeric value.", token);
      }
      break;
    case "fontFamily":
      if (!(typeof value === "string" && value.trim()) &&
          !(Array.isArray(value) && value.length && value.every(item => typeof item === "string" && item.trim()))) {
        addIssue(errors, "invalid-font-family", "fontFamily must be a non-empty string or array of strings.", token);
      }
      break;
    case "fontWeight":
      if (!isFontWeight(value)) {
        addIssue(errors, "invalid-font-weight",
          "fontWeight must be a number from 1 to 1000 or a predefined DTCG weight keyword.", token);
      }
      break;
    case "typography":
      if (!isObject(value)) {
        addIssue(errors, "invalid-typography", "Typography composite value must be an object.", token);
      } else {
        for (const key of ["fontFamily", "fontSize", "fontWeight", "lineHeight"]) {
          if (!(key in value)) addIssue(warnings, "incomplete-typography", 'Typography token is missing "' + key + '".', token);
        }
        if (value.fontFamily !== undefined && !isAlias(value.fontFamily) &&
            !(typeof value.fontFamily === "string" ||
              (Array.isArray(value.fontFamily) && value.fontFamily.every(item => typeof item === "string")))) {
          addIssue(errors, "invalid-typography-font-family", "Typography fontFamily must be a string, string array, or alias.", token);
        }
        if (value.fontSize !== undefined && !isAlias(value.fontSize) && !isDimension(value.fontSize)) {
          addIssue(errors, "invalid-typography-font-size", "Typography fontSize must be a DTCG dimension object or alias.", token);
        }
        const weight = value.fontWeight;
        if (weight !== undefined && !isAlias(weight) && !isFontWeight(weight)) {
          addIssue(errors, "invalid-typography-font-weight", "Typography fontWeight must be a valid DTCG font weight or alias.", token);
        }
        if (value.lineHeight !== undefined && !isAlias(value.lineHeight) &&
            (typeof value.lineHeight !== "number" || !Number.isFinite(value.lineHeight))) {
          addIssue(errors, "invalid-typography-line-height", "Typography lineHeight must be a finite number or alias.", token);
        }
        const letterSpacing = value.letterSpacing;
        if (letterSpacing !== undefined && !isAlias(letterSpacing) && !isDimension(letterSpacing)) {
          addIssue(errors, "invalid-typography-letter-spacing", "Typography letterSpacing must be a DTCG dimension object or alias.", token);
        }
      }
      break;
    case "cubicBezier":
      if (!(Array.isArray(value) && value.length === 4 && value.every(Number.isFinite) &&
            value[0] >= 0 && value[0] <= 1 && value[2] >= 0 && value[2] <= 1)) {
        addIssue(errors, "invalid-cubic-bezier", "cubicBezier must contain four finite numbers; x coordinates must be between 0 and 1.", token);
      }
      break;
    default:
      warnings.push({
        code: "composite-type-not-deeply-validated",
        token,
        message: 'Type "' + type + '" is recognized but its nested composite structure is not fully validated by this lightweight validator.'
      });
      break;
  }
}
function findAliases(value, owner, aliases) {
  if (isAlias(value)) {
    aliases.push({ owner, reference: value.slice(1, -1) });
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
      addIssue(warnings, "unknown-type", 'Type "' + ownType + '" is not in the validator known DTCG type list.', parts.join("."));
    }
    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      const childKeys = Object.keys(node).filter(key => !key.startsWith("$"));
      if (childKeys.length) {
        addIssue(errors, "token-and-group-mixed", "A token cannot also contain child token/group properties.", parts.join("."));
      }
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
      addIssue(errors, "unresolved-alias",
        'Alias references missing token "{' + alias.reference + '}".', alias.owner);
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
      addIssue(errors, "circular-alias",
        "Circular alias detected: " + [...chain, name].join(" -> ") + ".", name);
      return;
    }
    if (visited.has(name)) return;
    visited.add(name);
    visiting.add(name);
    for (const next of graph.get(name) ?? []) {
      if (tokens.has(next)) detectCycle(next, [...chain, name]);
    }
    visiting.delete(name);
  }
  for (const name of graph.keys()) {
    visiting.clear();
    visited.clear();
    detectCycle(name);
  }
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
  let resolvedFile;
  try {
    resolvedFile = await resolveWithinProject(process.cwd(), file);
    document = JSON.parse(await readFile(resolvedFile, "utf8"));
  } catch (error) {
    console.error(JSON.stringify({
      valid: false,
      errors: [{ code: "read-or-parse-error", message: error.message }],
      warnings: []
    }, null, 2));
    process.exitCode = 2;
    return;
  }
  const result = validateTokenDocument(document);
  console.log(JSON.stringify({ file: resolvedFile, ...result }, null, 2));
  if (!result.valid) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
