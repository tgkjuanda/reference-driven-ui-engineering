#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".vue", ".svelte", ".html"]);
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "dist", "build", "coverage", ".turbo", ".venv", "vendor"]);
const RISK_PATTERNS = [
  { category: "dangerous-html", pattern: /dangerouslySetInnerHTML/g },
  { category: "dynamic-eval", pattern: /\beval\s*\(/g },
  { category: "dynamic-function", pattern: /new\s+Function\s*\(/g },
  { category: "document-write", pattern: /document\.write\s*\(/g },
  { category: "direct-innerHTML", pattern: /\.innerHTML\s*=/g }
];
const SECRET_PATTERNS = [
  { category: "github-token", pattern: /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/ },
  { category: "aws-access-key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { category: "private-key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { category: "slack-token", pattern: /xox[baprs]-[A-Za-z0-9-]{20,}/ }
];

export function scanSourceText(file, content) {
  const findings = [];
  const lines = content.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    for (const item of RISK_PATTERNS) {
      if (item.pattern.test(line)) findings.push({ file, line: index + 1, category: item.category, severity: "review-required", message: "Review potentially unsafe dynamic content or execution." });
      item.pattern.lastIndex = 0;
    }
    for (const item of SECRET_PATTERNS) {
      if (item.pattern.test(line)) findings.push({ file, line: index + 1, category: item.category, severity: "high", message: "Potential secret detected; value intentionally redacted." });
    }
  }
  return findings;
}

export function summarizeDependencyAudit(audit) {
  const counts = audit?.metadata?.vulnerabilities ?? {};
  const high = Number(counts.high ?? 0);
  const critical = Number(counts.critical ?? 0);
  const moderate = Number(counts.moderate ?? 0);
  const low = Number(counts.low ?? 0);
  return {
    counts: { critical, high, moderate, low, total: Number(counts.total ?? (critical + high + moderate + low)) },
    status: critical > 0 || high > 0 ? "fail" : moderate > 0 || low > 0 ? "partial" : "pass"
  };
}

async function walk(root, relative = "") {
  const results = [];
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) results.push(...await walk(root, child));
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(child);
    }
  }
  return results;
}

export async function runSecurityAudit({ root = process.cwd(), dependencyAudit = true } = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await walk(absoluteRoot);
  const findings = [];
  for (const relative of files) {
    const full = path.join(absoluteRoot, relative);
    const content = await readFile(full, "utf8");
    findings.push(...scanSourceText(relative.split(path.sep).join("/"), content));
  }
  let dependency = { status: "partial", counts: null, message: "Dependency audit was not run." };
  if (dependencyAudit) {
    const lockPresent = await Promise.all(["package-lock.json"].map(async name => {
      try { await readFile(path.join(absoluteRoot, name)); return true; } catch { return false; }
    })).then(values => values.some(Boolean));
    if (lockPresent) {
      const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
        cwd: absoluteRoot, encoding: "utf8", timeout: 60000, maxBuffer: 5 * 1024 * 1024
      });
      try {
        const audit = JSON.parse(result.stdout || "{}");
        dependency = { ...summarizeDependencyAudit(audit), message: result.error?.message ?? null };
      } catch {
        dependency = { status: "partial", counts: null, message: result.error?.message ?? (result.stderr || "npm audit did not return valid JSON.") };
      }
    } else {
      dependency = { status: "partial", counts: null, message: "No package-lock.json found; npm dependency audit was not run." };
    }
  }

  const secretFindings = findings.filter(item => item.severity === "high");
  const reviewFindings = findings.filter(item => item.severity === "review-required");
  const status = secretFindings.length || dependency.status === "fail" ? "fail" :
    reviewFindings.length || dependency.status === "partial" ? "partial" : "pass";
  return {
    schemaVersion: "1.0.0",
    checkedAt: new Date().toISOString(),
    root: absoluteRoot,
    status,
    sourceFilesScanned: files.length,
    findings,
    dependencyAudit: dependency,
    summary: {
      potentialSecrets: secretFindings.length,
      reviewRequiredPatterns: reviewFindings.length
    },
    limitations: [
      "This is a lightweight source-pattern and npm dependency check, not a full SAST, DAST, threat model, or penetration test.",
      "Potential unsafe API usage requires manual context review and may be a false positive.",
      "Only selected token formats are detected; absence of findings does not prove that no secrets exist.",
      "Dependency audit covers production npm dependencies in package-lock.json when registry access is available."
    ]
  };
}

async function main() {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf("--root"), outIndex = args.indexOf("--out");
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node security-audit.mjs [--root .] [--out artifacts/ui-reference/security.json] [--no-dependency-audit]");
    return;
  }
  const root = rootIndex >= 0 ? args[rootIndex + 1] : process.cwd();
  const out = outIndex >= 0 ? args[outIndex + 1] : null;
  if (rootIndex >= 0 && (!root || root.startsWith("--"))) throw new Error("Missing value for --root.");
  if (outIndex >= 0 && (!out || out.startsWith("--"))) throw new Error("Missing value for --out.");
  const report = await runSecurityAudit({ root, dependencyAudit: !args.includes("--no-dependency-audit") });
  if (out) {
    const fs = await import("node:fs/promises");
    const destination = path.resolve(out);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 2; });
}
