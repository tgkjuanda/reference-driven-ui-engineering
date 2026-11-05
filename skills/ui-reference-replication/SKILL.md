---
name: ui-reference-replication
description: Reconstruct responsive, accessible web interfaces from Figma, website URLs, screenshots, or images. Requires direct visual perception of both the reference and rendered implementation; reverse-engineers design systems, motion, and visual effects, then verifies fidelity with visual QA.
license: MIT
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
  version: "2.2.0"
  standard: agent-skills
---

# UI Reference Replication Engine

## Mission

Reconstruct a working, maintainable UI from an inspected visual reference. Preserve its visual identity, improve usability where necessary, and verify the rendered result against the reference. A plausible-looking implementation without perceptual comparison is not complete.

## Mandatory visual capability prerequisite

**Read `references/visual-capability-gate.md` before doing any project analysis or implementation.**

This Skill requires the current agent to directly perceive:
- The supplied reference image/screenshot or rendered reference website.
- Screenshots of the implementation at matching routes, viewports, and states.
- Motion recordings or captured animation frames when motion is in scope.

If the agent cannot visually inspect both the reference and its own rendered output, **reject the Skill for this task and stop**. Do not fall back to text-only reconstruction, DOM/CSS inspection, Figma metadata, OCR, screenshot paths, or pixel-diff numbers as a substitute for visual perception. State the missing capability and request a vision-capable agent/runtime. Do not modify the project after this prerequisite fails.

## Portability

This is a vendor-neutral Agent Skill. Use the host agent's available browser, Figma, filesystem, terminal, and testing tools. Detect actual capabilities; never assume a tool exists or invent a tool call. The Skill does not grant credentials, browser access, Figma permissions, write access, or image/video perception.

Read the bundled references as needed:
- `references/visual-capability-gate.md` for the mandatory vision prerequisite and rejection behavior.
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
2. **Reference-centered:** the provided reference is the visual source of truth. Do not redesign it without permission.
3. **Evidence-led:** distinguish inspected facts, measurements, estimates, and unknowns.
4. **No fabricated access:** never claim to inspect hidden Figma frames, private pages, assets, styles, or visual output that were not accessible.
5. **Preserve the project:** inspect the current stack, dependencies, routing, components, and conventions before editing.
6. **Consistency:** use canonical design tokens and reusable components; document justified exceptions.
7. **Accessible by construction:** target WCAG 2.2 AA for applicable criteria. Do not reproduce accessibility defects just because they appear in the reference.
8. **Responsive by evidence:** follow supplied responsive frames first; otherwise document inferred behavior and test representative widths.
9. **Functional feedback:** interactive controls need perceivable states, validation, and recovery behavior.
10. **Intentional motion:** reconstruct supported motion and effects with reusable tokens, a clear purpose, reduced-motion behavior, and performance checks.
11. **Verify, then claim:** only report tests that actually ran. Do not claim pixel-perfect, perceptually verified, WCAG-compliant, or fully tested without evidence.
12. **Respect rights and access:** use authorized reference assets. Do not bypass authentication, paywalls, or licensing restrictions.

## Operating workflow

### 1. Visual capability preflight

Run the mandatory visual capability gate first. Confirm that the model can inspect reference and implementation visuals in the current session. Confirm visual access to animation recordings/frames when motion is in scope. If any mandatory visual input or output cannot be perceived, reject and stop before project changes.

### 2. Intake and reference inspection

Identify reference type, scope, target screens, available viewport sizes, expected interactions, and whether the task is visual-only or functional.

Inspect all accessible reference evidence:
- Figma: selected frames, layer hierarchy, Auto Layout, constraints, variables, styles, component variants, annotations, Code Connect mappings, and the actual visual appearance of selected reference frames.
- Website: rendered page, navigation, relevant interaction states, viewport behavior, loaded assets, and observable motion/effects.
- Screenshot/image: source dimensions, page bounds, geometry, hierarchy, colors, typography, and visible states. Do not infer animation timing or easing from a static image.

Create a reference inventory and uncertainty log. When reference visuals are inaccessible, ask for an authorized export or accessible browser reference; do not guess.

### 3. Inspect the codebase

Read package manifests, lockfiles, framework/build configuration, routes, styling, existing design tokens, component library, and test setup. Detect the actual framework and available browser/testing tools. Reuse existing infrastructure; do not install or replace dependencies without a reason.

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

Record sources and confidence for inferred values. Static screenshots establish appearance, not animation timing. Inspect live behavior or recordings for motion.

### 5. Plan and implement

Implement in this order:
1. Canonical design and motion tokens.
2. Application shell and macro layout.
3. Shared components and variants.
4. Screen content and assets.
5. Interaction behavior and feedback states.
6. Motion and visual effects, using a consistent motion system.
7. Responsive adaptations and reduced-motion alternatives.
8. Accessibility semantics and keyboard behavior.

Follow the existing project's framework and conventions. Do not introduce unrelated visual elements, arbitrary gradients, generic stock imagery, emoji icons, or unrequested redesigns. Do not duplicate components for superficial differences. Do not add a motion library unless the existing stack cannot meet the required behavior cleanly.

### 6. Run the QA toolkit

Scripts live beside this file in `scripts/`. Run them from the user's project root where required.

- `node <skill>/scripts/inspect-project.mjs --root .`
- `node <skill>/scripts/validate-tokens.mjs <path-to-token-json>`
- `node <skill>/scripts/capture-screenshots.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference`
- `python <skill>/scripts/compare-screenshots.py reference.png actual.png --diff artifacts/ui-reference/diff.png`
- `node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000`

The browser scripts require Playwright in the project/runtime. Accessibility audit additionally requires axe-core. For motion, inspect actual key transitions and test the reduced-motion preference; use browser recording/performance tools when needed. Screenshot files must be visually accessible to the agent, not merely saved on disk. If dependencies are absent, state the blocker and provide the exact setup command; never silently install packages.

### 7. Visual correction loop

Compare reference and implementation at identical viewport, route, scroll position, and UI state. Inspect side-by-side screenshots and overlays perceptually; use pixel heatmaps as supporting diagnostics, not as a replacement for visual judgment. Classify the highest-impact discrepancies, map them to responsible components/tokens, change the smallest responsible code surface, re-capture, and visually confirm the improvement without regression. Fix macro geometry first, then typography, color, component dimensions, assets, motion, and micro-details. Re-run tests after meaningful changes. Keep a defect log with severity, evidence, correction, and retest result.

### 8. Delivery report

Report screens covered, files changed, reference limitations, design and motion tokens/components reused, interactions and animations implemented, viewports and motion preferences tested, screenshot/recording evidence visually inspected, test commands/results, visual-diff diagnostics, accessibility findings, performance observations, and unresolved deviations.

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

Gate 1 is a hard prerequisite. If it fails, reject and stop; do not mark the rest of the gates as passed or imply the task was completed. Do not collapse failed or untested gates into a global pass.

## Iteration stop condition

Continue fixing the highest-impact visually verified discrepancy while the expected benefit is meaningful and tools/evidence permit. Stop only when the agreed tolerance is met, remaining issues are documented, or a specific access/tooling limitation blocks further work. Never invent a numeric fidelity score from subjective visual inspection.
