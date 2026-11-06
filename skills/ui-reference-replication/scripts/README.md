# Community Edition Helper Scripts

These optional helpers support reference-faithful implementation. They are utilities, not a replacement for direct visual inspection.

## Project inspection

```bash
node <skill>/scripts/inspect-project.mjs --root .
```

Reports basic project files, framework indicators, package scripts, and detected browser/test tools.

## Screenshot capture

Requires Playwright in the target project:

```bash
node <skill>/scripts/capture-screenshots.mjs \
  --url http://localhost:3000 \
  --routes /,/dashboard \
  --viewports 390x844,768x1024,1440x900 \
  --out artifacts/ui-reference
```

The output manifest lists the captured routes, viewport dimensions, response status, and page errors. Open and visually inspect the screenshots.

## Screenshot comparison

Requires Python and Pillow:

```bash
python <skill>/scripts/compare-screenshots.py \
  reference.png actual.png \
  --diff artifacts/ui-reference/diff.png \
  --heatmap artifacts/ui-reference/heatmap.png \
  --overlay artifacts/ui-reference/overlay.png
```

The script produces a raw difference image, heatmap, and optional overlay. Pixel metrics are diagnostic only; font rendering, antialiasing, dynamic content, and browser differences affect the result.

## Design-token validation

```bash
node <skill>/scripts/validate-tokens.mjs path/to/design-tokens.json
```

The validator supports a subset of DTCG token structures. It is not a complete DTCG conformance validator.

## Accessibility scan

Requires Playwright and axe-core in the target project:

```bash
node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000
```

Automated findings do not replace manual keyboard, focus, semantics, and content review.

## Runtime honesty

No helper can prove that an agent visually understood the reference. The current agent must inspect the source and rendered screenshots directly. Report only checks that actually ran.
