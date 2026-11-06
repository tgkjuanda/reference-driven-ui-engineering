# Visual QA and Screenshot Refinement

## Screenshot protocol

Capture the source reference and implementation at the same:
- Viewport width and height.
- Route/page.
- Scroll position.
- Application state.
- Color scheme and device scale factor where possible.

Wait for fonts, images, and stable layout. Save screenshots with descriptive names and preserve the source images.

## Comparison

Use side-by-side inspection, overlays, and pixel-difference heatmaps where available. A pixel metric is a diagnostic signal, not a perceptual-fidelity score. Differences can be caused by antialiasing, browser/OS font rendering, dynamic data, or timing.

Correct differences in this order:
1. Macro geometry and content alignment.
2. Information hierarchy and text wrapping.
3. Typography and major color fields.
4. Component sizes, gaps, and padding.
5. Images, icons, borders, and surfaces.
6. Minor visual details.

## Functional and responsive QA

Run the project's build, type, lint, and test scripts where available. Check console errors, failed requests, broken assets, route behavior, responsive overflow, and key interaction states.

## Accessibility QA

Run an automated checker when available and complete manual keyboard checks. Automated scanners do not prove full WCAG conformance.

## Iteration log

For each material discrepancy, record:
- Expected vs actual.
- Screenshot location.
- Severity.
- Likely cause.
- Correction applied.
- Retest result.

Do not invent an overall similarity percentage from subjective review. If computing pixel-difference metrics, label the metric and threshold precisely.
