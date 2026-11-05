# QA Toolkit

This guide is shipped with the UI Reference Replication Skill. Consumer-project commands below work from the root of the application being inspected or tested.

Set \`SKILL_DIR\` to the directory where the Skill is installed. Replace the example path when your agent uses a different location:

\`\`\`bash
SKILL_DIR=".agents/skills/ui-reference-replication"
\`\`\`

Keep the Skill path separate from the consumer project's root. Do not assume the Skill is installed under the source repository's \`skills/\` directory.

## Repository-maintainer checks (source checkout only)

These commands are for maintainers who have cloned the Skill's source repository. Run them from that repository's root. They are not required for an application project that only has the installed Skill.

\`\`\`bash
npm test
npm run check
npm run validate:tokens
\`\`\`

## Token-efficient task plan

Run the dependency-free planner from the consumer project root. It selects relevant guidance and direct script paths without loading every reference:

\`\`\`bash
node "$SKILL_DIR/scripts/plan-task.mjs" \\
  --work-mode existing-redesign \\
  --fidelity reference-inspired-creative \\
  --motion --accessibility --responsive
\`\`\`

Add \`--json\` for automation. The planner does not measure provider token usage.

## Project inspection

\`\`\`bash
node "$SKILL_DIR/scripts/inspect-project.mjs" --root .
\`\`\`

## Screenshot capture

Requires Playwright in the consumer project:

\`\`\`bash
npm install -D playwright
npx playwright install chromium
node "$SKILL_DIR/scripts/capture-screenshots.mjs" \\
  --url http://localhost:3000 \\
  --routes /,/dashboard \\
  --out artifacts/ui-reference/screenshots \\
  --viewports 390x844,768x1024,1440x900
\`\`\`

The script waits for network idle where possible, waits for fonts, captures each route/viewport pair, records page errors, and writes a screenshot manifest. It captures the implementation; obtain the reference screenshot from the source website or an authorized Figma export/MCP.

## Pixel-difference diagnostic

Requires Python and Pillow:

\`\`\`bash
python -m pip install Pillow
python "$SKILL_DIR/scripts/compare-screenshots.py" \\
  reference.png actual.png \\
  --diff artifacts/ui-reference/diff.png \\
  --heatmap artifacts/ui-reference/heatmap.png \\
  --overlay artifacts/ui-reference/overlay.png
\`\`\`

The output contains a raw diff, colorized heatmap, optional overlay, changed-pixel ratio, and normalized mean absolute error. These metrics are browser/font/antialiasing sensitive and are not a complete perceptual score. Capture the same viewport, state, and device scale factor.

## Accessibility audit

Requires Playwright and axe-core in the consumer project:

\`\`\`bash
npm install -D playwright axe-core
npx playwright install chromium
node "$SKILL_DIR/scripts/accessibility-audit.mjs" \\
  --url http://localhost:3000 \\
  --out artifacts/ui-reference/accessibility.json
\`\`\`

The axe-core scan is automated evidence only. Keyboard, screen reader, focus order, and usability checks still require manual review.

## Token validator scope

The included validator checks a useful subset of DTCG 2025.10 token structure and common value types, including colors, dimensions, durations, font family/weight, typography, curly-brace aliases, unresolved aliases, and circular aliases. It is not a complete DTCG conformance validator; advanced composite types and JSON Pointer property-level references are not fully validated.

## Visual evidence manifest validation

Start from \`$SKILL_DIR/templates/visual-evidence.example.json\`, replace the example paths and review notes, and run:

\`\`\`bash
node "$SKILL_DIR/scripts/validate-visual-evidence.mjs" \\
  --file artifacts/ui-reference/visual-evidence.json --root .
\`\`\`

The dependency-free validator checks relative paths, file existence, PNG headers, matching image dimensions, duplicate capture IDs, review completeness, and SHA-256 hashes. It rejects path traversal outside the evidence root. A passing report confirms manifest integrity and a declared review record—not actual visual perception or design correctness.

## Functional regression runner

Requires Playwright in the consumer project and a project-specific config based on \`$SKILL_DIR/templates/functional-regression.example.json\`.

\`\`\`bash
npm install -D playwright
npx playwright install chromium
node "$SKILL_DIR/scripts/run-functional-regression.mjs" \\
  --config tests/ui-regression.json --label baseline \\
  --out artifacts/ui-reference/baseline.json
node "$SKILL_DIR/scripts/run-functional-regression.mjs" \\
  --config tests/ui-regression.json --label post-redesign \\
  --out artifacts/ui-reference/post-redesign.json
node "$SKILL_DIR/scripts/compare-regression.mjs" \\
  --baseline artifacts/ui-reference/baseline.json \\
  --actual artifacts/ui-reference/post-redesign.json \\
  --out artifacts/ui-reference/regression-comparison.json
\`\`\`

Supported actions include click, fill, select-option, check, uncheck, press, and visibility/text/enabled/URL assertions. The config is explicit; the runner does not infer business behavior. Use sanitized test accounts and data.

The comparator identifies new regressions, missing baseline checks, failing new checks, resolved failures, and pre-existing failures. Its \`no-new-regressions-with-existing-failures\` status is not a fully passing suite.

## Perceptual visual review scorecard

After inspecting the source and implementation images directly, create a scorecard from \`$SKILL_DIR/templates/perceptual-visual-review.example.json\` and run:

\`\`\`bash
node "$SKILL_DIR/scripts/validate-visual-review.mjs" \\
  --file artifacts/ui-reference/visual-review.json \\
  --evidence artifacts/ui-reference/visual-evidence.json --root .
\`\`\`

The validator checks required review dimensions for the selected fidelity mode and verifies each review references a capture ID, route, and state from the visual evidence manifest. It reports Pass, Partial, or Fail without calculating a single visual score. This is a structural validation of an agent-declared review, not proof of actual visual perception.

## Responsive audit

Requires Playwright and Chromium in the consumer project:

\`\`\`bash
npm install -D playwright
npx playwright install chromium
node "$SKILL_DIR/scripts/run-responsive-audit.mjs" \\
  --url http://localhost:3000 --routes /,/dashboard \\
  --viewports 390x844,768x1024,1440x900 \\
  --out artifacts/ui-reference/responsive.json
\`\`\`

Checks document horizontal overflow, mobile viewport metadata, navigation failures, and uncaught page errors. The check does not identify every clipped element or replace screenshot-based visual inspection.

## Performance budget audit

Copy \`$SKILL_DIR/templates/performance-budget.example.json\` into the consumer project and set project-specific limits:

\`\`\`bash
node "$SKILL_DIR/scripts/run-performance-audit.mjs" \\
  --url http://localhost:3000 \\
  --budget artifacts/ui-reference/performance-budget.json \\
  --routes /,/dashboard --out artifacts/ui-reference/performance.json
\`\`\`

Metrics include TTFB, FCP, LCP, CLS, observed Long Task blocking time, and transfer sizes. The runner uses Playwright browser lab observations; it does not provide field Core Web Vitals. Long Task blocking time is an approximation, not Lighthouse TBT. Missing cross-origin transfer sizes remain untested.

## Dependency security audit

Requires an npm lockfile in the consumer project:

\`\`\`bash
node "$SKILL_DIR/scripts/run-dependency-audit.mjs" \\
  --root . --fail-on high \\
  --out artifacts/ui-reference/dependency-audit.json
\`\`\`

This summarizes npm dependency advisories and never modifies dependencies. It is not SAST, secret scanning, infrastructure testing, or penetration testing.

## Unified quality report

Start from \`$SKILL_DIR/templates/quality-report.example.json\`. Update task modes, statuses, reasons, next actions, and evidence paths:

\`\`\`bash
node "$SKILL_DIR/scripts/validate-quality-report.mjs" \\
  --file artifacts/ui-reference/quality-report.json --root .
\`\`\`

The validator requires task-specific gates and checks that cited evidence files exist under the report root. It does not execute the reported tests or prove agent-declared visual perception.

## Benchmark comparison

Use the same scenario/fixture, project commit, and agent/model/runtime. Run at least three repetitions per side. Only provider/host-reported token data are eligible for measured savings claims; quality regressions block savings claims.

\`\`\`bash
node "$SKILL_DIR/scripts/benchmark.mjs" \\
  validate --file artifacts/ui-reference/benchmark.json --root .
node "$SKILL_DIR/scripts/benchmark.mjs" \\
  compare --baseline artifacts/ui-reference/baseline-benchmark.json \\
  --candidate artifacts/ui-reference/candidate-benchmark.json \\
  --minimum-runs 3 --root .
\`\`\`

## Agent compatibility matrix

Record real installation evidence and separate runtime outcomes for visual input, browser, terminal, file-write, Figma MCP, and motion review. Do not populate untested agent records.

\`\`\`bash
node "$SKILL_DIR/scripts/validate-agent-compatibility.mjs" \\
  --file artifacts/ui-reference/agent-compatibility.json --root .
\`\`\`
