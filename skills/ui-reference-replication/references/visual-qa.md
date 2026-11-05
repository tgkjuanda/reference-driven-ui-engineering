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


## Agent-driven correction loop

The comparison script does not modify application code. The Agent performs the correction loop using the evidence it produces:

1. Capture the actual screenshot with the same route, viewport, and state as the reference.
2. Generate raw diff, heatmap, and optional overlay.
3. Inspect the highest-impact regions and map them to components or tokens.
4. Create a defect record: element, expected, actual, source evidence, severity, and likely code owner.
5. Change the smallest responsible component or token. Avoid global CSS patches that merely hide symptoms.
6. Re-capture the exact route, viewport, and state; compare again.
7. Keep the change only if it improves the intended mismatch without causing regressions elsewhere.
8. Run build/type/test and accessibility checks after meaningful changes.
9. Repeat until the user-agreed tolerance is reached, remaining differences are low impact, or a documented tool/reference limit blocks further work.

Never optimize only for changed-pixel ratio. Antialiasing and font rendering can create pixel differences while geometry and semantics are correct. Combine metrics with visual review, accessibility checks, and functional tests.
