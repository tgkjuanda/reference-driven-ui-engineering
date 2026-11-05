# UI/UX Quality Gates

This document turns the skill's design principles into reviewable acceptance criteria. A rendered page is not automatically a good interface.

## 1. Reference-centered design

- Every screen, major region, component, and key style decision points to a Figma frame/node, URL, screenshot, or explicitly documented inference.
- Keep an evidence ledger with source, viewport, confidence, and missing information.
- Resolve conflicts using this order: explicit user direction → authorized structured design data and variables → exact reference frame/screenshot → live rendered page → documented inference.
- Do not add unrelated visual sections or redesign the reference without permission.
- A reference with an accessibility defect is not a reason to reproduce the defect; preserve visual language while correcting the barrier and documenting the deviation.

**Evidence:** reference inventory, hierarchy map, uncertainty log, visual comparison screenshots.

## 2. Consistency

- Use one canonical token layer for repeated design decisions.
- Use shared components for repeated patterns.
- Use explicit component variants rather than near-duplicate components.
- Keep typography, spacing, controls, icons, radii, borders, and feedback states consistent.
- Any exception must have a reference-backed reason.

**Evidence:** token file, component inventory, exception list.

## 3. Minimize implementation errors

- Inspect project framework, package versions, routes, conventions, and existing components before editing.
- Trace implementation requirements to reference evidence.
- Prefer typed interfaces and existing lint/type-check/test commands.
- Validate form constraints, state transitions, navigation destinations, and data formatting.
- Check browser console, missing assets, failed requests, build output, and unintended overflow.
- Never state a test passed unless it was run and its output inspected.

**Evidence:** build/test outputs, changed-file summary, unresolved defect list.

## 4. Accessibility

Use WCAG 2.2 Level AA as the target for applicable web content; it is not a certification claim.

Review:
- Semantic landmarks, heading structure, and accessible names.
- Keyboard operation, logical focus order, visible focus, and absence of keyboard traps.
- Form labels, required/help text, error identification, and programmatic associations.
- Text/non-text contrast, including interactive states.
- Meaningful image alternatives and decorative image handling.
- Dialog focus entry/containment/return and keyboard dismissal where appropriate.
- Status messages for asynchronous success/failure.
- Target size/spacing and pointer operation.
- Reflow, zoom, reduced motion, and information not conveyed by color alone.
- Automatically moving content against applicable pause/stop/hide requirements.
- Flashing content against applicable WCAG limits.

**Evidence:** manual keyboard test, accessibility-tool results if available, contrast review, motion-preference checks, list of failed/untested criteria.

## 5. Feedback and error prevention/recovery

Every meaningful user action should have a perceivable result. Define applicable states:
- idle/default,
- hover/focus/pressed/selected,
- disabled,
- loading/pending,
- empty,
- success,
- validation error,
- system/network error.

Prevent avoidable errors with input constraints, helper text, safe defaults, clear action labels, and confirmation before destructive/irreversible actions. Preserve user input on failed validation/network requests when safe. Provide retry or recovery steps. Never show success before the operation succeeds.

**Evidence:** interaction/state matrix and tested primary flows.

## 6. Responsive behavior

- Use actual supplied viewport frames as primary evidence.
- Document how layout changes between them: reflow, collapse, wrap, scroll, reorder, or hide.
- If source widths are not supplied, test representative narrow-phone, tablet, and desktop widths and label them as implementation checks, not source evidence.
- Ensure no unintended horizontal scrolling, clipped content, inaccessible primary actions, or unusable controls.
- Prefer fluid layout and content-driven breakpoints over arbitrary fixed coordinates.
- Verify that motion, hover-only affordances, and large visual effects remain usable on touch and narrow viewports.

**Evidence:** viewport matrix and screenshots for each tested width.

## 7. Visual hierarchy

- Preserve the reference's information hierarchy, primary task, primary action, and reading order.
- Record the intended hierarchy before coding.
- Use semantic heading order and landmarks consistent with content meaning.
- Maintain hierarchy across breakpoints; do not let secondary content visually dominate the primary task.

**Evidence:** hierarchy map and desktop/mobile comparison.

## 8. Design tokens

- Create one canonical token source and semantic mapping.
- Separate raw/primitive values from semantic roles.
- Cover color, typography, spacing, sizing, radius, border, shadow, breakpoint, and motion where used.
- Reference-derived values must retain source and confidence.
- Avoid hardcoded duplicates where a token exists.
- Prefer the DTCG Format Module 2025.10 for portable token exchange where practical. Validate actual conformance before claiming it.

**Evidence:** token JSON/CSS and source-to-token mapping.

## 9. Component-driven development

- Identify repeated patterns before building page-specific markup.
- Define component anatomy, variants, props, accessibility semantics, and states.
- Reuse existing project components when they match.
- Avoid both extremes: copy-pasted components and excessive abstraction of one-off elements.
- Where a component workbench exists, document the variants and states there.

**Evidence:** component inventory, implementation file map, story/test coverage where available.

## 10. Figma-to-code synchronization

When authorized Figma structured access exists:
- Inspect variables, styles, components, variants, annotations, frames, and Code Connect mappings.
- Map Figma variables to code tokens, and Figma component instances to reusable code components.
- Record file/page/frame/node identity and revision/time when available.
- Detect missing mappings, changed values, unused tokens, missing variants, and visual drift.
- Default sync direction is Figma/reference → code. Write back to Figma only after explicit user instruction and with authorized write access.
- Present a diff before changing shared variables/components. Never silently overwrite unrelated design system work.

Without Figma API/MCP access, create a manual evidence map and label synchronization as manual/reference-based, not live or bidirectional.

**Evidence:** Figma-to-code map and drift report, or explicit access limitation.

## 11. Motion behavior and visual effects

Treat motion and effects as part of the design system, not optional decoration.

Review:
- Motion purpose and trigger for every meaningful animation.
- Duration, delay, easing, distance, sequence, interruption, and exit behavior.
- Consistent reusable motion tokens.
- Hover, focus, pressed, loading, success, error, and navigation transitions.
- Scroll-linked, ambient, and automatically moving content.
- Gradients, blur/backdrop blur, shadows, glow, filters, masks, clipping, transparency, SVG, and 3D effects.
- Reduced-motion alternatives that preserve meaning and functionality.
- Focus stability, text readability, contrast, and pointer/touch usability during motion.
- Rendering cost, layout/paint work, jank, and fallbacks for expensive effects.

Use `prefers-reduced-motion: reduce` to respect user system preferences. WCAG 2.2 SC 2.3.3 Animation from Interactions is Level AAA, not AA; this project nevertheless adopts reduced-motion support for non-essential interaction-triggered movement as an explicit quality policy. Automatically moving content and flashing content must also be reviewed against applicable WCAG 2.2 AA criteria, including SC 2.2.2 and SC 2.3.1 where applicable.

**Evidence:** motion inventory, token map, normal/reduced-motion test results, key-state captures or recordings, automatic-motion review, performance observations, fallback and defect log.

## Delivery scorecard

Use a status per gate:

| Gate | Status | Evidence | Known gap |
|---|---|---|---|
| Reference fidelity | Pass / Partial / Fail / Not tested | | |
| Consistency | Pass / Partial / Fail / Not tested | | |
| Error minimization | Pass / Partial / Fail / Not tested | | |
| Accessibility | Pass / Partial / Fail / Not tested | | |
| Feedback/error recovery | Pass / Partial / Fail / Not tested | | |
| Responsive behavior | Pass / Partial / Fail / Not tested | | |
| Visual hierarchy | Pass / Partial / Fail / Not tested | | |
| Design tokens | Pass / Partial / Fail / Not tested | | |
| Component-driven development | Pass / Partial / Fail / Not tested | | |
| Figma/code sync | Pass / Partial / Fail / Not tested | | |
| Motion/effects | Pass / Partial / Fail / Not tested | | |

Do not hide a failed or untested gate behind an overall "complete" status.


## Reference standards and implementation guidance

- [WCAG 2.2 — W3C Recommendation](https://www.w3.org/TR/WCAG22/): use as the accessibility target and test applicable success criteria.
- [Understanding Animation from Interactions — W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions): Level AAA guidance on disabling non-essential interaction-triggered motion.
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion): platform preference for reducing non-essential motion.
- [High-performance CSS animations — web.dev](https://web.dev/articles/animations-guide): rendering-pipeline guidance for animation performance.
- [Figma MCP Server documentation](https://developers.figma.com/docs/figma-mcp-server/): structured design context, variables, components, and design-to-code workflow.
- [Figma file-structure guidance](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/): component naming, variables, Auto Layout, annotations, and Code Connect.
- [Design Tokens Community Group — 2025.10](https://www.designtokens.org/tr/2025.10/): portable token format reference.

These sources guide the workflow; the skill must still inspect the actual project and reference. Do not assert conformance to WCAG or the DTCG format merely because the workflow references these standards.


## Automated evidence available in this repository

- `scripts/inspect-project.mjs`: detects the existing project stack and available test/browser tools.
- `scripts/validate-tokens.mjs`: validates a supported subset of DTCG 2025.10 token values, aliases, and common structural errors. It is not a complete DTCG conformance validator.
- `scripts/capture-screenshots.mjs`: captures the implementation at configured routes and viewport sizes using Playwright.
- `scripts/compare-screenshots.py`: produces a raw pixel diff, colorized heatmap, optional overlay, and pixel metrics.
- `scripts/accessibility-audit.mjs`: runs axe-core against a target URL. It does not replace manual accessibility testing.
- `npm test` and `npm run check`: test the repository's validator and skill structure.

Motion inventory, recording, reduced-motion behavior, and performance profiling remain consumer-project runtime checks; the current repository CI does not test a user's rendered animations. A screenshot comparison still requires an authorized reference screenshot. Figma MCP may supply a source screenshot when connected; a screenshot capture of the local app alone cannot establish reference fidelity.
