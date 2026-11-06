---
name: ui-reference-replication
description: Builds and redesigns web/app interfaces to closely match supplied screenshots, reference images, Figma frame exports, public website pages, mockups, and wireframes. Use by default for reference-led UI implementation and visual comparison.
license: MIT
summary: "Build reference-matched web interfaces and redesign existing UI while preserving product behavior."
version: "4.0.2"
tags:
  - frontend
  - ui-design
  - agent-skills
keywords:
  - screenshot-to-code
  - reference-driven-ui
  - figma
  - ui-redesign
use_cases:
  - "Build a new interface from screenshots, mockups, or Figma frame exports."
  - "Redesign existing UI while preserving routes, data, and workflows."
  - "Compare rendered screens against a supplied visual reference."
docs_url: "https://github.com/tgkjuanda/reference-driven-ui-engineering"
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
  version: "4.0.2"
  standard: agent-skills
---

# UI Reference Replication

## Mission

Recreate a supplied visual reference as a working interface in the target project. Treat the reference as the visual specification—not as loose inspiration. Match its observable layout, hierarchy, typography, color, spacing, component structure, assets, and visible interaction states as closely as the available evidence allows.

The Community Edition has one fidelity target: **Reference-Faithful**. Do not invent a different visual direction, freely reinterpret the reference, or substitute a generic design. When the user asks for a substantially different or original design direction, explain that this edition is limited to faithful reference implementation.

## Scope boundary

This edition supports Reference-Faithful implementation only. When a request requires an original visual direction or substantial creative reinterpretation rather than matching supplied evidence, state that this edition does not cover the requested workflow. Do not silently switch to a different design approach.


## Default activation

Use this Skill by default when the user asks to create, build, implement, recreate, replicate, redesign, restyle, or visually compare a web/app interface and provides or points to visual reference evidence.

Reference evidence includes:
- Screenshots, UI images, and photos of screens.
- Figma frame exports or screenshots supplied by the user.
- Public website pages that can be inspected without bypassing access controls.
- Mockups, wireframes, prototypes, and visual specifications.

Do not route backend-only work, unrelated code maintenance, content-only writing, general design discussion, or tasks without UI implementation or visual comparison to this Skill. Preserve the user's explicit scope.

## Work modes

Select and report one work mode before implementation:

1. **New Build:** create an interface from the reference within the target project's existing stack.
2. **Existing UI Redesign:** update the visual layer of an existing application while preserving its routes, features, data, permissions, APIs, validation, and workflows by default.
3. **Hybrid:** redesign selected existing screens and create new screens only where requested.

For Existing UI Redesign, read `references/existing-ui-redesign.md` before editing code.

## Mandatory visual capability gate

**Read `references/visual-capability-gate.md` before project analysis or implementation.**

The active agent must directly inspect:
- The source reference.
- The rendered implementation at matching routes, viewports, and UI states.

If direct visual inspection of both is unavailable, stop before modifying the project. Do not replace visual perception with text descriptions, DOM/CSS inspection, OCR, Figma metadata, screenshot file paths, or pixel-difference numbers. Explain the missing capability. Never claim visual verification without seeing the images.

## Non-negotiable rules

1. **Reference fidelity:** treat the supplied reference as the visual source of truth. Match observable details; do not redesign by preference.
2. **Evidence before assumptions:** separate observed details from inferred details. Record unknowns rather than fabricate them.
3. **Preserve existing behavior:** in redesign mode, do not remove or alter routes, features, data, permissions, APIs, validation, or workflows unless the user explicitly requests it.
4. **Inspect before editing:** identify the framework, dependencies, routes, components, design tokens, and project conventions first.
5. **Use consistent components:** reuse existing components where appropriate; avoid duplicated markup and arbitrary one-off styling.
6. **Accessible implementation:** use semantic HTML, keyboard-operable controls, visible focus, appropriate labels, and readable contrast. Do not reproduce an accessibility defect simply because it appears in a reference.
7. **Responsive behavior:** follow supplied responsive references. When none exist, infer conservatively and inspect representative narrow and wide viewports.
8. **Functional feedback:** interactive controls need clear focus, pressed, loading, disabled, success, and error feedback where applicable.
9. **Authorized assets:** use only assets the user supplied or is authorized to access. Do not bypass authentication, paywalls, or asset restrictions.
10. **Verify, then claim:** report only checks actually performed. Do not claim pixel-perfect, fully tested, or compliant without evidence.

## Operating workflow

### 1. Visual preflight

Read the visual capability gate. Confirm that the current agent can inspect the source reference and the rendered implementation. Stop if either is unavailable.

### 2. Project inspection

Inspect the target project's framework, package scripts, routes, component library, styles, design tokens, and existing test commands. In redesign mode, record the existing screens and critical workflows before changing them.

Use the project conventions. Do not replace the stack or add dependencies without a task-specific reason.

### 3. Reference analysis

Create a compact reference inventory:

- Page bounds, major regions, grid, alignment, and spacing.
- Information hierarchy and reading order.
- Typography, font scale, weights, and line-height.
- Colors, borders, radii, shadows, and surfaces.
- Components, variants, icons, and supplied assets.
- Visible states and interactions.
- Responsive differences when more than one reference viewport is supplied.

Use the source image or rendered page as evidence. Do not infer hidden screens, unseen interaction behavior, or animation timing from a static screenshot.

### 4. Implementation

Implement in this order:

1. Establish the page structure and macro layout.
2. Reuse or create the required shared components.
3. Apply reference-derived design tokens for color, typography, spacing, sizing, borders, and radii.
4. Implement the visible content and authorized assets.
5. Implement interactions and feedback states shown or required by the product.
6. Adapt layout for the supplied responsive references or conservative fallback widths.
7. Apply semantic and keyboard-accessible markup.

Keep deviations from the reference limited to product constraints, accessibility, technical limitations, or missing evidence. Document material deviations.

### 5. Visual comparison

Capture the implementation at the same viewport, route, scroll position, and state as the source reference. Inspect both images side by side.

Prioritize corrections in this order:
1. Page geometry and major alignment.
2. Information hierarchy and typography.
3. Component dimensions, spacing, and color.
4. Assets, borders, radii, and surface details.
5. Small visual differences.

Pixel-difference scripts may help locate changed regions, but their metrics are not a perceptual quality score and must not decide visual acceptance by themselves.

### 6. Functional and responsive checks

For an existing application, verify that the routes, important interactions, forms, data views, and workflows identified before editing still work. Run the target project's existing tests when available.

Inspect representative narrow and wide viewports. Check for clipped content, unintended horizontal overflow, inaccessible controls, and broken navigation.

### 7. Delivery report

Report:
- Work mode and reference source.
- Main routes/screens changed.
- Files changed.
- Visual comparison performed and the viewports inspected.
- Existing behavior preserved and tests actually run.
- Known deviations, blockers, and checks not performed.

Do not report an unchecked item as passed.

## Basic helper scripts

The repository includes optional helpers for common reference-led work:

- `scripts/inspect-project.mjs` — inspect the target project's stack and available tooling.
- `scripts/capture-screenshots.mjs` — capture routes at selected viewport sizes with Playwright.
- `scripts/compare-screenshots.py` — generate pixel-difference diagnostics for two same-size screenshots.
- `scripts/validate-tokens.mjs` — validate the supported subset of design-token structures used by the example.
- `scripts/accessibility-audit.mjs` — run an axe-core scan when the target project has the required dependencies.

Run scripts from the target project root where required. Install no dependencies silently. A helper's successful exit status proves only what that helper checks; it does not prove that a design is visually accurate.

## References

Read only the documents needed for the task:
- `references/visual-capability-gate.md` — mandatory visual prerequisite.
- `references/existing-ui-redesign.md` — behavior preservation for existing applications.
- `references/design-system-engineering.md` — tokens and reusable components.
- `references/responsive-and-interactions.md` — responsive layouts and interaction states.
- `references/accessibility.md` — accessible implementation and basic checks.
- `references/visual-qa.md` — screenshot comparison and visual correction.

## Runtime limitations

This Skill provides instructions and optional scripts. It does not grant browser control, terminal access, filesystem permissions, credentials, Figma access, or image/video perception. Detect the capabilities actually available in the active agent/runtime. Stop when the mandatory visual prerequisite fails.
