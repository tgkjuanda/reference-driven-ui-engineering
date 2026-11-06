#!/usr/bin/env node
import { readFile, writeFile, access, realpath } from "node:fs/promises";
import path from "node:path";

function arg(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(".." + path.sep) && relative !== ".." && !path.isAbsolute(relative));
}
async function resolveWithinProject(root, requested, label = "path") {
  const base = await realpath(root);
  const candidate = path.resolve(base, requested);
  if (!isInside(base, candidate)) throw new Error(label + " must stay inside the project directory.");
  let probe = candidate;
  while (true) {
    try {
      const actual = await realpath(probe);
      if (!isInside(base, actual)) throw new Error(label + " resolves through a symlink outside the project directory.");
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
const root = path.resolve(arg("--root", process.cwd()));
const output = arg("--output");

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}
async function readJson(file) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch { return null; }
}
const pkg = await readJson(path.join(root, "package.json"));
const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };

const frameworkCandidates = [
  ["next", "Next.js"], ["react", "React"], ["vue", "Vue"],
  ["nuxt", "Nuxt"], ["svelte", "Svelte"], ["@sveltejs/kit", "SvelteKit"],
  ["astro", "Astro"], ["angular", "Angular"], ["vite", "Vite"]
];
const frameworks = frameworkCandidates.filter(([key]) => deps[key]).map(([, name]) => name);
const tools = {
  playwright: Boolean(deps.playwright || deps["@playwright/test"]),
  playwrightCoreOnly: Boolean(deps["playwright-core"] && !deps.playwright && !deps["@playwright/test"]),
  cypress: Boolean(deps.cypress),
  axeCore: Boolean(deps["axe-core"]),
  vitest: Boolean(deps.vitest),
  jest: Boolean(deps.jest),
  storybook: Object.keys(deps).some(key => key.startsWith("@storybook/")),
  tailwind: Boolean(deps.tailwindcss || deps["@tailwindcss/postcss"]),
  eslint: Boolean(deps.eslint),
  typescript: Boolean(deps.typescript)
};
const candidates = [
  "src/components", "src/ui", "components", "app/components",
  "src/styles", "styles", "src/assets", "public", "tests", "e2e",
  ".storybook", "storybook"
];
const directories = [];
for (const relative of candidates) {
  if (await exists(path.join(root, relative))) directories.push(relative);
}
const lockfiles = [];
for (const name of ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock"]) {
  if (await exists(path.join(root, name))) lockfiles.push(name);
}
const warnings = [];
if (!pkg) warnings.push("No package.json found at project root; framework/dependency detection is incomplete.");
if (!tools.playwright) warnings.push(tools.playwrightCoreOnly ? "Only playwright-core is detected. The bundled capture script expects playwright or @playwright/test; playwright-core also requires a configured browser executable." : "Playwright is not detected. Browser screenshot capture will require installing or configuring it.");
if (!tools.axeCore) warnings.push("axe-core is not detected. Automated accessibility audit will require axe-core.");
if (!directories.some(dir => /components|ui/.test(dir))) warnings.push("No conventional component directory detected; inspect project structure manually.");
const report = {
  generatedAt: new Date().toISOString(),
  root,
  package: pkg ? { name: pkg.name ?? null, version: pkg.version ?? null, packageManager: pkg.packageManager ?? null } : null,
  frameworks,
  dependencies: Object.keys(deps).sort(),
  tools,
  lockfiles,
  detectedDirectories: directories,
  warnings
};
const json = JSON.stringify(report, null, 2);
if (output) {
  const destination = await resolveWithinProject(root, output, "--output");
  await writeFile(destination, json + "\n", "utf8");
  console.error(`Wrote ${path.relative(root, destination)}`);
}
console.log(json);
