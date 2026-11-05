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
