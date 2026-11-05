# Visual QA and Iterative Refinement

## Screenshot protocol

Capture the reference and implementation at the same:
- viewport width and height,
- route/page,
- scroll position,
- application state,
- color scheme and device scale factor where possible.

Wait for fonts/images and stable layout. Disable non-essential animation during capture if the test tool supports it. Save screenshots with descriptive names and preserve source images.

## Comparison

Use side-by-side inspection, overlays, and pixel-difference heatmaps. A pixel metric is a diagnostic signal, not a complete perceptual-fidelity score. Differences can be caused by antialiasing, browser/OS font rendering, dynamic data, or animation.

Fix in order:
1. Macro geometry and content alignment.
2. Information hierarchy and text wrapping.
3. Typography and major color fields.
4. Component sizes, gaps, and padding.
5. Images, icons, borders, and shadows.
6. Minor details and motion.

Use explicit masking only for genuinely dynamic areas; document each mask to avoid hiding real defects.

## Functional and responsive QA

Run project build/type/lint/test scripts where available. Check console errors, failed requests, broken assets, route behavior, responsive overflow, and key interaction states.

## Accessibility QA

Run axe-core or another available checker and manual keyboard tests. Automated scanners do not prove full WCAG conformance.

## Iteration log

For each discrepancy:
- Severity (critical/high/medium/low).
- Evidence location.
- Expected vs actual.
- Likely cause.
- Correction applied.
- Retest result.

Do not invent an overall similarity percentage from subjective review. If computing pixel-difference metrics, label the metric and threshold precisely.
