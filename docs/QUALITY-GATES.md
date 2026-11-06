# Community Edition Quality Gates

The Community Edition has a focused acceptance standard: implement the supplied reference faithfully, preserve the existing product, and verify the result visually.

## Required gates

### 1. Visual capability

The agent must directly inspect the source reference and its own rendered implementation. If either visual input or output is unavailable, stop before editing. Text-only reconstruction does not pass this gate.

### 2. Reference understanding

Before implementation, record the source and inspect:
- Main page regions, layout geometry, alignment, and spacing.
- Information hierarchy and reading order.
- Typography, colors, borders, radii, and surfaces.
- Visible components, assets, and UI states.
- Responsive differences that are actually shown in supplied references.

Distinguish observed facts from assumptions. Do not invent missing details.

### 3. Reference fidelity

Compare the implementation with the source at equivalent routes, viewports, scroll positions, and states. Correct the most visible deviations first. Any material difference must have a product, accessibility, or technical reason.

Pixel-difference measurements are diagnostic only. They are not a visual-quality score.

### 4. Product preservation

For existing UI redesigns, preserve existing routes, features, data, permissions, APIs, validation, and workflows unless a functional change has been explicitly requested. Verify the important existing flows after implementation.

### 5. Responsive behavior

Use supplied viewport references where available. Otherwise inspect representative narrow and wide widths. Check for clipped content, unintended horizontal overflow, broken navigation, and inaccessible primary actions.

### 6. Basic accessibility and interaction

Use semantic elements, labels, keyboard-operable controls, visible focus, readable contrast, and clear feedback for important actions. Automated axe-core findings do not replace manual checks.

### 7. Honest delivery report

Record routes/screens changed, screenshots inspected, tests actually run, existing behavior checked, known deviations, and anything not tested. A skipped check must not be reported as passed.

## Optional repository helpers

- `inspect-project.mjs`: project and tooling inventory.
- `capture-screenshots.mjs`: route/viewport screenshot capture.
- `compare-screenshots.py`: pixel-difference diagnostics.
- `validate-tokens.mjs`: validates a supported subset of the example token structure.
- `accessibility-audit.mjs`: automated axe-core scan when dependencies are present.

These helpers do not replace direct visual inspection or project-specific testing.
