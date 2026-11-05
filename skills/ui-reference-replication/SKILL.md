---
name: ui-reference-replication
description: Reconstruct new interfaces or redesign existing applications from Figma, website URLs, screenshots, or images. Requires direct visual perception of both reference and implementation; preserves existing product behavior during reference-driven visual redesign and verifies fidelity with visual QA.
license: MIT
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
  version: "2.3.0"
  standard: agent-skills
---

# UI Reference Replication Engine

## Mission

Reconstruct or redesign a working interface from an inspected visual reference. Support both new UI implementation and redesign of an existing product. Preserve existing product behavior by default, match the reference's visual language, and verify the rendered result. A plausible-looking implementation without perceptual comparison is not complete.

## Work modes

Select and report one mode before implementation:

1. **New build:** implement a new UI from the supplied reference within the existing project stack.
2. **Existing UI redesign:** restyle or restructure an existing application to follow the reference's visual theme while preserving its existing routes, features, data, permissions, and workflows by default.
3. **Hybrid:** redesign selected existing screens and build new screens only where explicitly requested.

For existing UI redesign, read `references/existing-ui-redesign.md` before modifying code. Do not silently turn a redesign request into a greenfield rebuild.

## Mandatory visual capability prerequisite

**Read `references/visual-capability-gate.md` before doing any project analysis or implementation.**

This Skill requires the current agent to directly perceive:
- The supplied reference image/screenshot or rendered reference website.
- Screenshots of the current application and redesigned implementation at matching routes, viewports, and states.
- Motion recordings or captured animation frames when motion is in scope.

If the agent cannot visually inspect both the reference and its own rendered output, **reject the Skill for this task and stop**. Do not fall back to text-only reconstruction, DOM/CSS inspection, Figma metadata, OCR, screenshot paths, or pixel-diff numbers as a substitute for visual perception. State the missing capability and request a vision-capable agent/runtime. Do not modify the project after this prerequisite fails.

## Portability

This is a vendor-neutral Agent Skill. Use the host agent's available browser, Figma, filesystem, terminal, and testing tools. Detect actual capabilities; never assume a tool exists or invent a tool call. The Skill does not grant credentials, browser access, Figma permissions, write access, or image/video perception.

Read the bundled references as needed:
- `references/visual-capability-gate.md` for the mandatory vision prerequisite and rejection behavior.
- `references/existing-ui-redesign.md` for controlled visual migration of an existing application.
- `references/figma-analysis.md` for Figma/URL/image evidence capture and design reverse engineering.
- `references/design-system-engineering.md` for tokens, hierarchy, and component-driven implementation.
- `references/accessibility.md` for WCAG-oriented implementation and audit.
- `references/responsive-and-interactions.md` for breakpoints, states, feedback, and error recovery.
- `references/motion-design.md` for motion inventory, animation, visual effects, reduced motion, and motion QA.
- `references/visual-qa.md` for screenshot capture, comparison, iteration, and reporting.
- `references/evidence-and-visual-qa.md` for worksheets and checklists.
- In the source repository, consult `docs/QUALITY-GATES.md`; when installed as a skill, use the bundled references instead.

## Non-negotiable rules

1. **Visual perception is mandatory:** inspect both source reference and rendered implementation. If not possible, stop.
2. **Reference-centered:** the provided reference is the visual source of truth for the appearance in scope. Do not redesign beyond that scope without permission.
3. **Existing behavior is protected:** in redesign mode, preserve routes, features, data, permissions, APIs, validation, and business workflows unless the user explicitly approves a change.
4. **Evidence-led:** distinguish inspected facts, measurements, estimates, and unknowns.
5. **No fabricated access:** never claim to inspect hidden Figma frames, private pages, assets, styles, or visual output that were not accessible.
6. **Preserve the project:** inspect the current stack, dependencies, routing, components, and conventions before editing.
7. **Consistency:** use canonical design tokens and reusable components; document justified exceptions.
8. **Accessible by construction:** target WCAG 2.2 AA for applicable criteria. Do not reproduce accessibility defects just because they appear in the reference.
9. **Responsive by evidence:** follow supplied responsive frames first; otherwise document inferred behavior and test representative widths.
10. **Functional feedback:** interactive controls need perceivable states, validation, and recovery behavior.
11. **Intentional motion:** reconstruct supported motion and effects with reusable tokens, a clear purpose, reduced-motion behavior, and performance checks.
12. **Verify, then claim:** only report tests that actually ran. Do not claim pixel-perfect, perceptually verified, WCAG-compliant, or fully tested without evidence.
13. **Respect rights and access:** use authorized reference assets. Do not bypass authentication, paywalls, or licensing restrictions.

## Operating workflow

### 1. Visual capability preflight

Run the mandatory visual capability gate first. Confirm that the model can inspect reference and implementation visuals in the current session. Confirm visual access to animation recordings/frames when motion is in scope. If any mandatory visual input or output cannot be perceived, reject and stop before project changes.

### 2. Intake and mode selection

Identify whether the user requests a new build, existing UI redesign, or hybrid task. Record target routes/screens, reference scope, viewport sizes, expected interactions, and what must remain unchanged.

For an existing UI redesign, complete the baseline and migration workflow in `references/existing-ui-redesign.md` before code changes.

### 3. Reference and project inspection

Inspect all accessible reference evidence:
- Figma: selected frames, layer hierarchy, Auto Layout, constraints, variables, styles, component variants, annotations, Code Connect mappings, and the actual visual appearance of selected reference frames.
- Website: rendered page, navigation, relevant interaction states, viewport behavior, loaded assets, and observable motion/effects.
- Screenshot/image: source dimensions, page bounds, geometry, hierarchy, colors, typography, and visible states. Do not infer animation timing or easing from a static image.

Inspect the target codebase, current design system, routes, components, application states, test coverage, and runtime behavior. In redesign mode, capture baseline screenshots and tests before editing.

Create a reference inventory and uncertainty log. When reference visuals are inaccessible, ask for an authorized export or accessible browser reference; do not guess.

### 4. Reverse-engineer design intent

Create:
- Screen and information-hierarchy map.
- Layout geometry and responsive behavior map.
- Typography, color, spacing, radius, border, shadow, sizing, and motion token map.
- Component inventory with variants and states.
- Motion inventory: element, purpose, trigger, properties, timing, easing, sequencing, interruption, responsive behavior, and reduced-motion alternative.
- Visual-effect inventory: gradients, blur, shadows, glow, masks, filters, transparency, illustration, and advanced rendering.
- Asset inventory with source and usage rights.
- Figma-to-code mapping when structured Figma access exists.
- In redesign mode, a current-product baseline and reference-to-existing-component migration map.

Record sources and confidence for inferred values. Static screenshots establish appearance, not animation timing. Inspect live behavior or recordings for motion.

### 5. Plan and implement

Implement in this order:
1. Protect and document existing product contracts when in redesign mode.
2. Canonical design and motion tokens.
3. Application shell and macro layout.
4. Shared components and variants.
5. Screen content and authorized assets.
6. Interaction behavior and feedback states.
7. Motion and visual effects, using a consistent motion system.
8. Responsive adaptations and reduced-motion alternatives.
9. Accessibility semantics and keyboard behavior.

Follow the existing project's framework and conventions. Do not introduce unrelated visual elements, arbitrary gradients, generic stock imagery, emoji icons, or unrequested redesigns. Do not duplicate components for superficial differences. Do not add a motion library unless the existing stack cannot meet the required behavior cleanly.

In redesign mode, use small reversible changes, preserve component/data/API contracts, and do not delete or disable existing functionality simply because it is absent from the reference. Any requested functional change must be identified separately and approved.

### 6. Run the QA toolkit

Scripts live beside this file in `scripts/`. Run them from the user's project root where required.

- `node <skill>/scripts/inspect-project.mjs --root .`
- `node <skill>/scripts/validate-tokens.mjs <path-to-token-json>`
- `node <skill>/scripts/capture-screenshots.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference`
- `python <skill>/scripts/compare-screenshots.py reference.png actual.png --diff artifacts/ui-reference/diff.png`
- `node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000`

The browser scripts require Playwright in the project/runtime. Accessibility audit additionally requires axe-core. In redesign mode, run the existing project's baseline and post-change regression tests. For motion, inspect actual key transitions and test the reduced-motion preference; use browser recording/performance tools when needed. Screenshot files must be visually accessible to the agent, not merely saved on disk. If dependencies are absent, state the blocker and provide the exact setup command; never silently install packages.

### 7. Visual correction and regression loop

Compare reference and implementation at identical viewport, route, scroll position, and UI state. Inspect side-by-side screenshots and overlays perceptually; use pixel heatmaps as supporting diagnostics, not as a replacement for visual judgment.

For a new build, classify visual discrepancies and correct the highest-impact issues.

For an existing UI redesign, run both:
- **Reference fidelity checks:** confirm the redesigned output follows the target style, hierarchy, components, effects, and motion.
- **Product regression checks:** confirm existing routes, features, data, permissions, APIs, forms, interactions, and workflows still behave as before unless explicitly changed.

Map discrepancies to responsible components/tokens, change the smallest responsible code surface, re-capture, and visually confirm improvement without regression. Keep a defect log with severity, evidence, correction, and retest result.

### 8. Delivery report

Report work mode, routes/screens covered, files changed, reference limitations, current behavior preserved, approved functional changes, design and motion tokens/components reused, interactions and animations implemented, viewports and motion preferences tested, screenshot/recording evidence visually inspected, baseline vs post-change test results, visual-diff diagnostics, accessibility findings, performance observations, and unresolved deviations.

## Required quality gates

Give every gate one status: **Pass**, **Partial**, **Fail**, or **Not tested**.

1. Mandatory visual perception of both reference and implementation.
2. Reference fidelity and visual hierarchy.
3. Design-token integrity and consistency.
4. Component reuse and state coverage.
5. Responsive behavior and overflow.
6. Keyboard, semantics, contrast, and WCAG 2.2 AA review.
7. Feedback, validation, prevention, and recovery.
8. Build, runtime, and regression checks.
9. Figma-to-code mapping and drift, or a clear statement that structured Figma access was unavailable.
10. Motion behavior, visual effects, reduced-motion alternatives, and motion performance.
11. In redesign mode: preservation of existing routes, features, data/API contracts, permissions, and critical workflows.

Gate 1 is a hard prerequisite. If it fails, reject and stop; do not mark the rest of the gates as passed or imply the task was completed. In redesign mode, gate 11 must have baseline and post-change evidence. Do not collapse failed or untested gates into a global pass.

## Iteration stop condition

Continue fixing the highest-impact visually verified discrepancy while the expected benefit is meaningful and tools/evidence permit. Stop only when the agreed tolerance is met, remaining issues are documented, or a specific access/tooling limitation blocks further work. Stop and request user approval before any unrequested change to business logic, data contracts, permissions, APIs, or destructive functionality. Never invent a numeric fidelity score from subjective visual inspection.
