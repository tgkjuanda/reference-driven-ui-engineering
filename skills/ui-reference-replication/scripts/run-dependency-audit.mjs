#!/usr/bin/env node
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
const SEVERITY = ["info", "low", "moderate", "high", "critical"];
export function summarizeNpmAudit(audit, failOn = "high") {
  const threshold = SEVERITY.indexOf(failOn);
  if (threshold < 0) throw new Error("failOn must be one of: " + SEVERITY.join(", "));
  if (!audit || !audit.metadata || !audit.metadata.vulnerabilities) throw new Error("npm audit JSON is missing metadata.vulnerabilities.");
  const vulnerabilities = audit.metadata.vulnerabilities;
  const counts = Object.fromEntries(SEVERITY.map(level => [level, Number(vulnerabilities[level] ?? 0)]));
  const affectedPackages = Object.entries(audit.vulnerabilities || {}).map(([name, item]) => ({ name, severity: item.severity || "unknown", direct: item.isDirect === true, range: item.range || null, fixAvailable: item.fixAvailable ?? false }));
  const blocked = SEVERITY.some((level, index) => index >= threshold && counts[level] > 0);
  return {
    status: blocked ? "fail" : "pass", failOn, counts,
    total: Number(vulnerabilities.total ?? SEVERITY.reduce((sum, level) => sum + counts[level], 0)),
    affectedPackages,
    limitation: "npm audit checks advisories in the npm dependency graph only; it is not a full source-code, secret, infrastructure, or application security audit."
  };
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node run-dependency-audit.mjs [--root .] [--fail-on high] [--omit-dev] [--out report.json]"); return; }
  const get = (name, fallback) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
  const root = path.resolve(get("--root", ".")), failOn = get("--fail-on", "high"), omitDev = args.includes("--omit-dev");
  if (!SEVERITY.includes(failOn)) throw new Error("Invalid --fail-on severity: " + failOn);
  let lockfile = null;
  for (const candidate of ["package-lock.json", "npm-shrinkwrap.json"]) {
    try { await access(path.join(root, candidate)); lockfile = candidate; break; } catch {}
  }
  if (!lockfile) throw new Error("npm audit requires package-lock.json or npm-shrinkwrap.json. Generate and commit a lockfile using the project's package manager first.");
  const commandArgs = ["audit", "--json"];
  if (omitDev) commandArgs.push("--omit=dev");
  let stdout = "", stderr = "", commandError = null;
  try {
    const result = await execFileAsync(process.platform === "win32" ? "npm.cmd" : "npm", commandArgs, { cwd: root, maxBuffer: 10 * 1024 * 1024, timeout: 120000 });
    stdout = result.stdout; stderr = result.stderr;
  } catch (error) { stdout = error.stdout ?? ""; stderr = error.stderr ?? ""; commandError = error.message; }
  let audit;
  try { audit = JSON.parse(stdout); } catch { throw new Error("npm audit did not return valid JSON. " + (commandError ?? stderr ?? "No diagnostic output.")); }
  const report = { schemaVersion: "1.0.0", generatedAt: new Date().toISOString(), root: path.relative(process.cwd(), root) || ".", lockfile, omitDev, commandExit: commandError ? "non-zero" : "zero", ...summarizeNpmAudit(audit, failOn) };
  const out = get("--out");
  if (out) { const destination = path.resolve(root, out); await mkdir(path.dirname(destination), { recursive: true }); await writeFile(destination, JSON.stringify(report, null, 2) + String.fromCharCode(10)); }
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 2; });
