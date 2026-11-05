#!/usr/bin/env node

const ROOT = "skills/ui-reference-replication";

const choices = {
  workMode: ["new-build", "existing-redesign", "hybrid"],
  fidelity: ["reference-faithful", "reference-inspired-creative"],
  scope: ["full", "visual", "functional", "audit"]
};

function parseArgs(argv) {
  const values = {
    workMode: null,
    fidelity: "reference-faithful",
    scope: "full",
    figma: false,
    motion: false,
    accessibility: false,
    responsive: false,
    performance: false,
    security: false,
    json: false
  };
  const flags = {
    "--work-mode": "workMode",
    "--fidelity": "fidelity",
    "--scope": "scope"
  };
  const booleans = {
    "--figma": "figma",
    "--motion": "motion",
    "--accessibility": "accessibility",
    "--responsive": "responsive",
    "--performance": "performance",
    "--security": "security",
    "--json": "json"
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (booleans[arg]) {
      values[booleans[arg]] = true;
      continue;
    }
    if (flags[arg]) {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      values[flags[arg]] = value;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!values.workMode) {
    throw new Error("Required: --work-mode new-build|existing-redesign|hybrid");
  }
  for (const [key, allowed] of Object.entries({
    workMode: choices.workMode,
    fidelity: choices.fidelity,
    scope: choices.scope
  })) {
    if (!allowed.includes(values[key])) {
      throw new Error(`Invalid ${key}: ${values[key]}. Allowed: ${allowed.join(", ")}`);
    }
  }
  return values;
}

function createPlan(options) {
  const readBefore = [
    `${ROOT}/references/visual-capability-gate.md`
  ];
  const loadWhenNeeded = [
    `${ROOT}/references/design-system-engineering.md`,
    `${ROOT}/references/responsive-and-interactions.md`,
    `${ROOT}/references/visual-qa.md`,
    `${ROOT}/references/evidence-and-visual-qa.md`
  ];
  const scripts = [];

  if (options.workMode === "existing-redesign" || options.workMode === "hybrid") {
    readBefore.push(`${ROOT}/references/existing-ui-redesign.md`);
  }
  if (options.fidelity === "reference-inspired-creative") {
    readBefore.push(
      `${ROOT}/references/creative-reference-mode.md`,
      `${ROOT}/references/anti-ai-slop.md`
    );
  }
  if (options.figma) readBefore.push(`${ROOT}/references/figma-analysis.md`);
  if (options.motion) loadWhenNeeded.push(`${ROOT}/references/motion-design.md`);
  if (options.accessibility || options.scope === "full") loadWhenNeeded.push(`${ROOT}/references/accessibility.md`);
  if (options.responsive || options.scope === "full") {
    loadWhenNeeded.push(`${ROOT}/references/responsive-and-interactions.md`);
    scripts.push("npm run audit:responsive -- --config <responsive-config.json> --out <responsive-report.json>");
  }
  if (options.performance || options.scope === "full") scripts.push("npm run audit:performance -- --config <performance-config.json> --out <performance-report.json>");
  if (options.security || options.scope === "full" || options.scope === "audit") {
    readBefore.push(`${ROOT}/references/performance-security.md`);
    scripts.push("npm run audit:security -- --root . --out <security-report.json>");
  }

  if (options.scope === "full" || options.scope === "audit") {
    scripts.push("node <skill>/scripts/inspect-project.mjs --root .");
  }
  if (options.scope === "full" || options.scope === "visual") {
    scripts.push("node <skill>/scripts/capture-screenshots.mjs --url <local-url> --routes <routes>");
    scripts.push("python <skill>/scripts/compare-screenshots.py <reference.png> <actual.png>");
    scripts.push("node <skill>/scripts/validate-visual-evidence.mjs --file <visual-evidence.json> --root .");
    scripts.push("node <skill>/scripts/validate-visual-review.mjs --file <visual-review.json> --evidence <visual-evidence.json> --root .");
  }
  if (options.accessibility || options.scope === "full") {
    scripts.push("node <skill>/scripts/accessibility-audit.mjs --url <local-url>");
  }
  if (options.scope === "full" || options.scope === "functional") {
    scripts.push("npm run regression -- --config <regression-config.json> --label baseline --out <baseline-report.json>");
    scripts.push("npm run regression -- --config <regression-config.json> --label post-redesign --out <post-report.json>");
    scripts.push("npm run compare:regression -- --baseline <baseline-report.json> --actual <post-report.json>");
    scripts.push("Run the target-project build, unit, interaction, and regression tests.");
  }

  const uniqueReadBefore = [...new Set(readBefore)];
  const uniqueOnDemand = [...new Set(loadWhenNeeded)].filter(item => !uniqueReadBefore.includes(item));

  return {
    version: "3.0.0",
    workMode: options.workMode,
    fidelity: options.fidelity,
    scope: options.scope,
    options: {
      figma: options.figma,
      motion: options.motion,
      accessibility: options.accessibility,
      responsive: options.responsive,
      performance: options.performance,
      security: options.security
    },
    readBeforeImplementation: uniqueReadBefore,
    loadOnlyWhenNeeded: uniqueOnDemand,
    suggestedChecks: [...new Set(scripts)],
    costControls: [
      "Do not load every reference file at task start.",
      "Reuse verified findings; re-read only after relevant changes or contradictory evidence.",
      "Return concise summaries with source paths and targeted error excerpts.",
      "Choose routes, viewports, and states by risk; do not omit mandatory checks to save tokens.",
      "Do not report token or cost savings unless the host exposes reliable measurements."
    ]
  };
}

function usage() {
  return [
    "Token-efficient task planner",
    "",
    "Usage:",
    "  node plan-task.mjs --work-mode <new-build|existing-redesign|hybrid> [options]",
    "",
    "Options:",
    "  --fidelity <reference-faithful|reference-inspired-creative>  Default: reference-faithful",
    "  --scope <full|visual|functional|audit>                       Default: full",
    "  --figma       Include Figma analysis guidance",
    "  --motion      Include motion design guidance",
    "  --accessibility Include accessibility guidance and scan",
    "  --responsive  Include responsive/interaction guidance and overflow checks",
    "  --performance Include lab performance budget audit",
    "  --security    Include frontend security review and dependency audit",
    "  --json        Print machine-readable JSON",
    "  --help        Show this help",
    "",
    "Example:",
    "  node plan-task.mjs --work-mode existing-redesign --fidelity reference-inspired-creative --motion --accessibility --responsive --performance --security"
  ].join("\n");
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
  } else {
    const plan = createPlan(options);
    if (options.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      console.log(`Task plan v${plan.version}`);
      console.log(`Work mode: ${plan.workMode} | Fidelity: ${plan.fidelity} | Scope: ${plan.scope}`);
      console.log("\nRead before implementation:");
      for (const item of plan.readBeforeImplementation) console.log(`- ${item}`);
      console.log("\nLoad only when needed:");
      for (const item of plan.loadOnlyWhenNeeded) console.log(`- ${item}`);
      console.log("\nSuggested checks:");
      for (const item of plan.suggestedChecks) console.log(`- ${item}`);
      console.log("\nCost controls:");
      for (const item of plan.costControls) console.log(`- ${item}`);
    }
  }
} catch (error) {
  console.error(error.message);
  console.error("Run with --help for usage.");
  process.exitCode = 2;
}
