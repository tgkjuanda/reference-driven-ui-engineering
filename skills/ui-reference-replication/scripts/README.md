# QA Toolkit

Run commands from the repository root or from the user's application project as shown.

## Dependency-free checks

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

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

The script waits for network idle where possible, waits for fonts, captures each route/viewport pair, records page errors, and writes a screenshot manifest.

## Pixel difference diagnostic

Requires Python and Pillow:

```bash
python -m pip install -r requirements-qa.txt
python skills/ui-reference-replication/scripts/compare-screenshots.py \
  reference.png actual.png \
  --diff artifacts/ui-reference/diff.png
```

The output contains a changed-pixel ratio and normalized mean absolute error. These metrics are browser/font/antialiasing sensitive and are not a complete perceptual score. Capture the same viewport, state, and device scale factor.

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
