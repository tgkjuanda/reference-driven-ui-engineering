# QA Toolkit

Run commands from the repository root or from the user's application project as shown.

## Dependency-free checks

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

## Token-efficient task plan

Select only the guidance relevant to the task:

```bash
node skills/ui-reference-replication/scripts/plan-task.mjs \\
  --work-mode existing-redesign \\
  --fidelity reference-inspired-creative \\
  --motion --accessibility --responsive
```

The planner is dependency-free and supports `--json` for automation. It does not measure provider token usage.

## Screenshot capture

Requires Playwright in the target app/project:

```bash
npm install -D playwright
npx playwright install chromium
node path/to/ui-reference-replication/skills/ui-reference-replication/scripts/capture-screenshots.mjs \
  --url http://localhost:3000 \
  --routes /,/dashboard \
  --out artifacts/ui-reference/screenshots \
  --viewports 390x844,768x1024,1440x900
```

The script waits for network idle where possible, waits for fonts, captures each route/viewport pair, records page errors, and writes a screenshot manifest. It captures the implementation; obtain the reference screenshot from the source website or authorized Figma export/MCP.

## Pixel difference diagnostic

Requires Python and Pillow:

```bash
python -m pip install -r requirements-qa.txt
python skills/ui-reference-replication/scripts/compare-screenshots.py \
  reference.png actual.png \
  --diff artifacts/ui-reference/diff.png \
  --heatmap artifacts/ui-reference/heatmap.png \
  --overlay artifacts/ui-reference/overlay.png
```

The output contains a raw diff, colorized heatmap, optional overlay, changed-pixel ratio, and normalized mean absolute error. These metrics are browser/font/antialiasing sensitive and are not a complete perceptual score. Capture the same viewport, state, and device scale factor.

## Accessibility audit

Requires Playwright and axe-core:

```bash
npm install -D playwright axe-core
npx playwright install chromium
node path/to/ui-reference-replication/skills/ui-reference-replication/scripts/accessibility-audit.mjs \
  --url http://localhost:3000 \
  --out artifacts/ui-reference/accessibility.json
```

The axe-core scan is automated evidence only. Keyboard, screen reader, focus order, and usability checks still require manual review.

## Token validator scope

The included validator checks a useful subset of DTCG 2025.10 token structure and common value types, including colors, dimensions, durations, font family/weight, typography, curly-brace aliases, unresolved aliases, and circular aliases. It is not a complete DTCG conformance validator; advanced composite types and JSON Pointer property-level references are not fully validated.


## Visual evidence manifest validation

Start from `skills/ui-reference-replication/templates/visual-evidence.example.json`, replace the example paths and review notes, and run:

```bash
npm run validate:visual-evidence -- --file artifacts/ui-reference/visual-evidence.json --root .
```

The dependency-free validator checks relative paths, file existence, PNG headers, matching image dimensions, duplicate capture IDs, review completeness, and SHA-256 hashes. It rejects path traversal outside the evidence root. A passing report confirms manifest integrity and a declared review record—not actual visual perception or design correctness.


## Functional regression runner

Requires Playwright in the target project and a project-specific config derived from `skills/ui-reference-replication/templates/functional-regression.example.json`.

```bash
npm run regression -- --config tests/ui-regression.json --label baseline --out artifacts/ui-reference/baseline.json
npm run regression -- --config tests/ui-regression.json --label post-redesign --out artifacts/ui-reference/post-redesign.json
npm run compare:regression -- --baseline artifacts/ui-reference/baseline.json --actual artifacts/ui-reference/post-redesign.json --out artifacts/ui-reference/regression-comparison.json
```

Supported actions include click, fill, select-option, check, uncheck, press, and visibility/text/enabled/URL assertions. The config is explicit; the runner does not infer business behavior. Use sanitized test accounts and data.

The comparator identifies new regressions, missing baseline checks, failing new checks, resolved failures, and pre-existing failures. Its `no-new-regressions-with-existing-failures` status is not a fully passing suite.


## Perceptual visual review scorecard

After inspecting the source and implementation images directly, create a scorecard from `skills/ui-reference-replication/templates/perceptual-visual-review.example.json` and run:

```bash
npm run validate:visual-review -- --file artifacts/ui-reference/visual-review.json --evidence artifacts/ui-reference/visual-evidence.json --root .
```

The validator checks required review dimensions for the selected fidelity mode and verifies each review references a capture ID, route, and state from the visual evidence manifest. It reports Pass, Partial, or Fail without calculating a single visual score. This is a structural validation of an agent-declared review, not proof of actual visual perception.


## Responsive audit

Requires Playwright and Chromium in the consumer project:

```bash
npm run responsive:audit -- --url http://localhost:3000 --routes /,/dashboard --viewports 390x844,768x1024,1440x900 --out artifacts/ui-reference/responsive.json
```

Checks document horizontal overflow, mobile viewport metadata, navigation failures, and uncaught page errors. The check does not identify every clipped element or replace screenshot-based visual inspection.

## Performance budget audit

Copy the performance budget template and set project-specific limits:

```bash
npm run performance:audit -- --url http://localhost:3000 --budget artifacts/ui-reference/performance-budget.json --routes /,/dashboard --out artifacts/ui-reference/performance.json
```

Metrics include TTFB, FCP, LCP, CLS, observed Long Task blocking time, and transfer sizes. The runner uses Playwright browser lab observations; it does not provide field Core Web Vitals. Long Task blocking time is an approximation, not Lighthouse TBT. Missing cross-origin transfer sizes remain untested.

## Dependency security audit

Requires an npm lockfile in the target project:

```bash
npm run security:audit -- --root . --fail-on high --out artifacts/ui-reference/dependency-audit.json
```

This summarizes npm dependency advisories and never modifies dependencies. It is not SAST, secret scanning, infrastructure testing, or penetration testing.

## Unified quality report

Start from the quality report example. Update task modes, statuses, reasons, next actions, and evidence paths:

```bash
npm run validate:quality-report -- --file artifacts/ui-reference/quality-report.json --root .
```

The validator requires task-specific gates and checks that cited evidence files exist under the report root. It does not execute the reported tests or prove agent-declared visual perception.
