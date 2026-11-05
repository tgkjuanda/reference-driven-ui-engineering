---
name: ui-reference-replication
description: Reconstruct responsive, accessible web interfaces from Figma, website URLs, screenshots, or images. Reverse-engineer design systems, motion, and visual effects; implement the existing project stack; and verify fidelity with automated screenshots, visual diffs, accessibility checks, and design-token validation.
license: MIT
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
  version: "2.1.0"
  standard: agent-skills
---

# UI Reference Replication Engine

## Mission

Turn an inspected design reference into a working, maintainable UI that preserves its visual identity and improves usability without inventing unseen details. The output is not complete until implementation evidence and a quality report exist.

Use this skill for Figma files, live websites, screenshots, mockups, and mixed references.

## Portability

This is a vendor-neutral Agent Skill. Use the host agent's available browser, Figma, filesystem, terminal, and testing tools. Detect actual capabilities; never assume a tool exists or invent a tool call. The skill does not grant credentials, browser access, Figma permissions, or write access.

Read the bundled references as needed:
- `references/figma-analysis.md` for Figma/URL/image evidence capture and design reverse engineering.
- `references/design-system-engineering.md` for tokens, hierarchy, and component-driven implementation.
- `references/accessibility.md` for WCAG-oriented implementation and audit.
- `references/responsive-and-interactions.md` for breakpoints, states, feedback, and error recovery.
- `references/motion-design.md` for motion inventory, animation, visual effects, reduced motion, and motion QA.
- `references/visual-qa.md` for screenshot capture, comparison, iteration, and reporting.
- `references/evidence-and-visual-qa.md` for worksheets and checklists.
- In the source repository, consult `docs/QUALITY-GATES.md`; when installed as a skill, use the bundled references instead.

## Non-negotiable rules

1. **Reference-centered:** the provided reference is the visual source of truth. Do not redesign it without permission.
2. **Evidence-led:** distinguish inspected facts, measurements, estimates, and unknowns.
3. **No fabricated access:** never claim to inspect hidden Figma frames, private pages, assets, or source styles that were not accessible.
4. **Preserve the project:** inspect the current stack, dependencies, routing, components, and conventions before editing.
5. **Consistency:** use canonical design tokens and reusable components; document justified exceptions.
6. **Accessible by construction:** target WCAG 2.2 AA for applicable criteria. Do not reproduce accessibility defects just because they appear in the reference.
7. **Responsive by evidence:** follow supplied responsive frames first; otherwise document inferred behavior and test representative widths.
8. **Functional feedback:** interactive controls need perceivable states, validation, and recovery behavior.
9. **Intentional motion:** reconstruct supported motion and effects with reusable tokens, a clear purpose, reduced-motion behavior, and performance checks. Do not add decorative motion without evidence or user approval.
10. **Verify, then claim:** only report tests that actually ran. Do not claim pixel-perfect, WCAG-compliant, or fully tested without evidence.
11. **Respect rights and access:** use authorized reference assets. Do not bypass authentication, paywalls, or licensing restrictions.

## Operating workflow

### 1. Intake and reference inspection

Identify reference type, scope, target screens, available viewport sizes, expected interactions, and whether the task is visual-only or functional.

Inspect all accessible reference evidence before implementation:
- Figma: selected frames, layer hierarchy, Auto Layout, constraints, variables, styles, component variants, annotations, and Code Connect mappings when available.
- Website: full page, navigation, relevant interaction states, viewport behavior, loaded assets, and observable motion/effects.
- Screenshot/image: source dimensions, page bounds, geometry, hierarchy, colors, typography, and visible states. Do not infer timing or easing from a static image.

Create a reference inventory and uncertainty log. When the reference is inaccessible, ask for an authorized export or screenshot rather than guessing.

### 2. Inspect the codebase

Read package manifests, lockfiles, framework/build configuration, routes, styling, existing design tokens, component library, and test setup. Detect the actual framework and available browser/testing tools. Reuse existing infrastructure; do not install or replace dependencies without a reason.

### 3. Reverse-engineer design intent

Create:
- Screen and information-hierarchy map.
- Layout geometry and responsive behavior map.
- Typography, color, spacing, radius, border, shadow, sizing, and motion token map.
- Component inventory with variants and states.
- Motion inventory: element, purpose, trigger, properties, timing, easing, sequencing, interruption, responsive behavior, and reduced-motion alternative.
- Visual-effect inventory: gradients, blur, shadows, glow, masks, filters, transparency, illustration, and any advanced rendering.
- Asset inventory with source and usage rights.
- Figma-to-code mapping when structured Figma access exists.

Record the source and confidence for every inferred value. Mark motion inferred from still images as unknown unless separate evidence exists.

### 4. Plan and implement

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

### 5. Run the QA toolkit

Scripts live beside this file in `scripts/`. Run them from the user's project root where required.

- `node <skill>/scripts/inspect-project.mjs --root .`
- `node <skill>/scripts/validate-tokens.mjs <path-to-token-json>`
- `node <skill>/scripts/capture-screenshots.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference`
- `python <skill>/scripts/compare-screenshots.py reference.png actual.png --diff artifacts/ui-reference/diff.png`
- `node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000`

The browser scripts require Playwright in the project/runtime. Accessibility audit additionally requires axe-core. For motion, inspect key transitions and test the reduced-motion preference; use browser recording/performance tools when needed. If dependencies are absent, state the blocker and provide the exact setup command; never silently install packages.

### 6. Fix by measured impact

Compare screenshots at identical viewport, route, and UI state. Generate raw diff, heatmap, and overlay where possible. Classify the highest-impact discrepancies, map them to the responsible component or token, change the smallest responsible code surface, re-capture the same state, and retain the change only if it improves fidelity without regression. Fix macro geometry first, then typography, color, component dimensions, assets, motion, and micro-details. Re-run tests after each meaningful fix. Keep a defect log with severity, evidence, correction, and retest result. Read references/visual-qa.md and references/motion-design.md for their respective evidence-driven correction loops.

### 7. Delivery report

Report screens covered, files changed, reference limitations, design and motion tokens/components reused, interactions and animations implemented, viewports and motion preferences tested, test commands/results, visual-diff metrics, accessibility findings, performance observations, and unresolved deviations.

## Required quality gates

Give every gate one status: **Pass**, **Partial**, **Fail**, or **Not tested**.

1. Reference fidelity and visual hierarchy.
2. Design-token integrity and consistency.
3. Component reuse and state coverage.
4. Responsive behavior and overflow.
5. Keyboard, semantics, contrast, and WCAG 2.2 AA review.
6. Feedback, validation, prevention, and recovery.
7. Build, runtime, and regression checks.
8. Figma-to-code mapping and drift, or a clear statement that structured Figma access was unavailable.
9. Motion behavior, visual effects, reduced-motion alternatives, and motion performance.

Do not collapse failed or untested gates into a global pass.

## Iteration stop condition

Continue fixing the highest-impact verified discrepancy while the expected benefit is meaningful and tools/evidence permit. Stop only when the agreed tolerance is met, remaining issues are documented, or a specific access/tooling limitation blocks further progress. Never invent a numeric fidelity score from subjective visual inspection.
