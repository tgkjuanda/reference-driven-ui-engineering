# UI/UX Quality Gates

This document turns the design and implementation principles into reviewable acceptance criteria. A rendered page is not automatically a good interface.

## 0. Mandatory visual-perception prerequisite

**Hard gate — must pass before implementation begins.**

- The executing agent must directly perceive the supplied reference image/screenshot or rendered website.
- The executing agent must directly perceive screenshots of its own implementation at matching routes, viewports, and UI states.
- If motion is in scope, the executing agent must inspect the relevant recording or captured animation frames.
- Screenshot capture, file paths, OCR, DOM/CSS inspection, Figma metadata, and pixel-diff values alone do not satisfy this requirement.
- If the executing agent cannot inspect both source and output visuals, reject the task and stop before changing the project.

**Evidence:** reference screenshot visibly inspected, implementation screenshot visibly inspected, and motion frames/recording visibly inspected when applicable. Record agent/runtime and tested capabilities.

## 1. Select work mode and fidelity mode

Work mode and fidelity mode are independent.

**Work mode:** New build / Existing UI redesign / Hybrid.

**Fidelity mode:**
- **Reference-Faithful:** close reproduction of source composition, hierarchy, visual language, components, and observable interactions.
- **Reference-Inspired Creative:** original interpretation that preserves selected design anchors but allows layout, component composition, exact colors, typography pairing, imagery, effects, and animation to be reimagined.

For creative mode, create a brief with four lists: Preserve, Reinterpret, Protect, and Avoid. Evaluate against this brief rather than exact pixel equality. Do not invent a numeric similarity score.

**Evidence:** declared modes and, for creative mode, an approved or documented creative direction brief.

## 2. Reference-centered design

- Every screen, major region, component, and key style decision points to a Figma frame/node, URL, screenshot, or explicitly documented inference.
- Keep an evidence ledger with source, viewport, confidence, and missing information.
- Resolve conflicts using this order: explicit user direction → authorized structured design data and variables → exact reference frame/screenshot → live rendered page → documented inference.
- Do not add unrelated visual sections or redesign the reference without permission in Reference-Faithful mode.
- In Reference-Inspired Creative mode, use the reference as visual direction, not a mandate to duplicate exact composition.
- Respect brand identity, asset licenses, trademarks, and third-party intellectual property.

**Evidence:** reference inventory, hierarchy map, uncertainty log, visual comparison screenshots.

## 3. Consistency

- Use one canonical token layer for repeated design decisions.
- Use shared components for repeated patterns.
- Use explicit component variants rather than near-duplicate components.
- Keep typography, spacing, controls, icons, radii, borders, and feedback states consistent.
- Any exception must have a reference-backed reason or a documented creative-direction reason.

**Evidence:** token file, component inventory, exception list.

## 4. Minimize implementation errors

- Inspect project framework, package versions, routes, conventions, and existing components before editing.
- Trace implementation requirements to reference evidence and the chosen fidelity mode.
- Prefer typed interfaces and existing lint/type-check/test commands.
- Validate form constraints, state transitions, navigation destinations, and data formatting.
- Check browser console, missing assets, failed requests, build output, and unintended overflow.
- Never state a test passed unless it was run and its output inspected.

**Evidence:** build/test outputs, changed-file summary, unresolved defect list.

## 5. Accessibility

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

## 6. Feedback and error prevention/recovery

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

## 7. Responsive behavior

- Use actual supplied viewport frames as primary evidence.
- Document how layout changes between them: reflow, collapse, wrap, scroll, reorder, or hide.
- If source widths are not supplied, test representative narrow-phone, tablet, and desktop widths and label them as implementation checks, not source evidence.
- Ensure no unintended horizontal scrolling, clipped content, inaccessible primary actions, or unusable controls.
- Prefer fluid layout and content-driven breakpoints over arbitrary fixed coordinates.
- Verify that motion, hover-only affordances, and large visual effects remain usable on touch and narrow viewports.

**Evidence:** viewport matrix and screenshots for each tested width.

## 8. Visual hierarchy and design intent

- Preserve the reference's information hierarchy, primary task, primary action, and reading order in Reference-Faithful mode.
- In Reference-Inspired Creative mode, preserve the hierarchy required by the target product; reinterpret the reference composition when it improves product fit.
- Use semantic heading order and landmarks consistent with content meaning.
- Maintain hierarchy across breakpoints; do not let secondary content visually dominate the primary task.

**Evidence:** hierarchy map and desktop/mobile comparison.

## 9. Design tokens

- Create one canonical token source and semantic mapping.
- Separate raw/primitive values from semantic roles.
- Cover color, typography, spacing, sizing, radius, border, shadow, breakpoint, and motion where used.
- Reference-derived values must retain source and confidence.
- Avoid hardcoded duplicates where a token exists.
- Prefer the DTCG Format Module 2025.10 for portable token exchange where practical. Validate actual conformance before claiming it.

**Evidence:** token JSON/CSS and source-to-token mapping.

## 10. Component-driven development

- Identify repeated patterns before building page-specific markup.
- Define component anatomy, variants, props, accessibility semantics, and states.
- Reuse existing project components when they match.
- Avoid both extremes: copy-pasted components and excessive abstraction of one-off elements.
- Where a component workbench exists, document the variants and states there.

**Evidence:** component inventory, implementation file map, story/test coverage where available.

## 11. Figma-to-code synchronization

When authorized Figma structured access exists:
- Inspect variables, styles, components, variants, annotations, frames, and Code Connect mappings.
- Map Figma variables to code tokens, and Figma component instances to reusable code components.
- Record file/page/frame/node identity and revision/time when available.
- Detect missing mappings, changed values, unused tokens, missing variants, and visual drift.
- Default sync direction is Figma/reference → code. Write back to Figma only after explicit user instruction and with authorized write access.
- Present a diff before changing shared variables/components. Never silently overwrite unrelated design system work.

Without Figma API/MCP access, create a manual evidence map and label synchronization as manual/reference-based, not live or bidirectional.

**Evidence:** Figma-to-code map and drift report, or explicit access limitation.

## 12. Motion behavior and visual effects

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

## 13. Existing UI redesign and behavior preservation

When redesigning an existing application to match or reinterpret a visual reference:

- Create a current-product baseline before editing: routes, navigation, permissions, forms, validation, API/data contracts, tables, search/filter/sort, dialogs, loading/error/empty/success states, analytics hooks, and critical workflows.
- Record baseline screenshots, current tests, and known defects.
- Separate visual direction from product behavior. The reference informs desired appearance; the existing application remains the source of truth for business behavior by default.
- Map reference visual patterns or design anchors to existing components before implementation.
- Preserve routes, features, data, permissions, validation, keyboard behavior, APIs, and workflows unless the user explicitly approves a functional change.
- Apply changes incrementally to shared tokens/components and migrate page families in controlled steps.
- Do not remove features because they are absent from the reference; do not replace live data with static/demo content.
- Do not change API payloads, database schemas, authentication, authorization, or business rules during a visual-only redesign.
- Run both visual-direction QA and existing-product regression QA after changes.

**Evidence:** baseline inventory, route/component migration map, baseline vs post-redesign test results, visually inspected before/after screenshots, preserved-contract record, regression/defect log.

## 14. Creative direction and originality (Reference-Inspired Creative mode)

Evaluate against the user's creative direction brief rather than exact pixel equality.

- **Preserve:** selected design anchors such as mood, broad color character, typography personality, density/rhythm, shape language, and motion personality.
- **Reinterpret:** layout, component composition, exact palette values, typography pairing, illustrations, imagery, visual effects, and motion choreography.
- **Protect:** target product identity, primary tasks, accessibility, responsive behavior, performance, existing product behavior in redesign mode, and asset rights.
- **Avoid:** literal copying when originality is requested, generic template output, inconsistent style mixtures, and decorative effects that weaken usability.

Judge whether the selected anchors remain recognizable, the implementation is original and coherent, and the design fits the product's content, audience, and tasks. A large pixel difference from the reference is not automatically a defect in this mode. Do not invent a similarity percentage.

**Evidence:** creative direction brief, visually inspected implementation, rationale for intentional deviations, product-fit and regression findings.

## 15. Design originality and anti-AI-slop (Reference-Inspired Creative mode)

- Begin from actual product tasks, audience, content, density, trust requirements, and brand identity—not a generic trend label.
- Define a product-specific design thesis and one or two distinctive visual devices.
- Reject interchangeable hero/card-grid templates, repetitive rounded-card sections, decorative badges, filler imagery/copy, fabricated metrics/testimonials/logos, and unmotivated icon/asset choices.
- Do not default to purple/blue gradients, aurora, glow, glassmorphism, neon, blur, 3D shapes, parallax, or scroll effects. These techniques are allowed only when justified by the reference, brand, product, or interaction.
- Preserve deliberate hierarchy, typography, composition, useful information density, and consistency across routes.
- Complete the de-slop review: product specificity, composition, purpose, restraint, typography, authenticity, consistency, product fit, accessibility, and regression.

**Evidence:** design thesis, visual rationale for signature elements, visually inspected result, de-slop review, removed/revised generic elements, authentic asset/content record.

## Delivery scorecard

Use a status per gate:

| Gate | Status | Evidence | Known gap |
|---|---|---|---|
| Visual perception prerequisite | Pass / Fail / Not tested | | |
| Work mode and fidelity mode declared | Pass / Fail / Not tested | | |
| Reference intent and fidelity-mode alignment | Pass / Partial / Fail / Not tested | | |
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
| Existing UI behavior preservation (redesign mode) | Pass / Partial / Fail / Not tested | | |
| Creative anchors/originality/product fit (creative mode) | Pass / Partial / Fail / Not tested | | |
| Anti-AI-slop / product-specific originality (creative mode) | Pass / Partial / Fail / Not tested | | |

If the visual-perception prerequisite fails or is not tested, do not begin implementation and do not report an overall pass. In redesign mode, behavior preservation must be backed by baseline and post-change evidence. In creative mode, evaluate against the design brief, not minimum pixel difference.

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

Repository CI validates the Skill and helper scripts; it does not prove the consumer UI's perceptual quality. Screenshot comparison only contributes to QA when the agent itself can inspect the source/output images.


## 16. Token-efficient execution

- Run the task planner with the selected work mode and fidelity mode before loading task-specific references.
- Read only mandatory and task-routed references; load conditional guidance when that subject enters scope.
- Keep a compact ledger of routes, viewports, states, protected behavior, verified findings, and unresolved unknowns.
- Reuse valid findings and rerun checks only when their inputs or code changed, or when new evidence contradicts prior results.
- Return concise diagnostic summaries while preserving links/paths to source evidence.
- Do not invent token counts or savings; do not skip mandatory quality gates to reduce context.

**Evidence:** planner output, task ledger, and actual checks performed. The planner is a context-selection aid, not a token meter.


## 17. Visual evidence package integrity

- Each important reference/implementation comparison has a unique ID, route, UI state, viewport, and device scale factor.
- Both source and implementation PNGs exist within the evidence root and have matching dimensions.
- The manifest records SHA-256 hashes for traceability.
- The review record identifies who/what declared the review, when it occurred, confirms both images were inspected, and records findings.
- Unreviewed or incomplete evidence cannot pass the manifest validator.
- A validator pass does not prove actual perception or correct judgement; the review remains agent-declared and subject to audit.

**Evidence:** validated manifest and preserved original screenshots.


## 18. Functional regression evidence

For existing UI redesign and hybrid projects with a runnable browser environment:

- Define project-specific checks for critical routes and interactions; do not infer undocumented workflows.
- Run the same declared checks against the pre-change baseline and post-change application.
- Compare reports by stable check ID.
- Detect new failures, missing baseline coverage, failed new checks, resolved failures, and pre-existing failures separately.
- Store sanitized reports without credentials, access tokens, personal information, or production secrets.
- Report a no-new-regressions outcome separately from a fully passing suite when pre-existing failures remain.

**Evidence:** baseline report, post-change report, comparison report, and the exact config used.


## 19. Structured perceptual visual review

- Use a structured review for the required dimensions: geometry, hierarchy, typography, spacing, color, components, responsive behavior, and composition.
- Reference-Faithful adds explicit reference-fidelity assessment.
- Reference-Inspired Creative adds design anchors, product fit, originality, and anti-slop assessment.
- Every dimension must be Pass, Partial, Fail, or Not Tested with observations.
- Partial/Fail findings require evidence and a corrective action; Not Tested requires a reason.
- A single numeric visual-quality score is not accepted as a substitute for dimension-level findings.
- The scorecard must refer to capture IDs in the validated visual evidence manifest.

**Evidence:** validated visual-review report plus the original reference and implementation screenshots. Review declarations are agent-reported and do not independently prove perception.


## 20. Responsive overflow matrix

- Run responsive checks on the agreed critical routes and mobile/tablet/desktop widths.
- Verify document/body horizontal overflow and visible elements outside the viewport.
- Review intentional scroll regions and overflow exclusions; keep exclusions narrow and documented.
- Automated overflow checks do not establish visual suitability, readability, or usable touch targets.

**Evidence:** responsive audit report and directly inspected screenshots for the same route/viewport pairs.

## 21. Performance budgets

- Define project-specific budgets for FCP, LCP, CLS, DOM nodes, resource count, and transfer bytes where measurable.
- Run lab measurements on representative routes and a consistent environment.
- Report unmeasurable values as Partial/Not Measurable, not Pass.
- Clearly distinguish lab diagnostics from field Core Web Vitals; this helper does not measure INP or RUM.

**Evidence:** performance report, config, route, environment, and limitations.

## 22. Frontend security review

- Run source-pattern scanning on selected frontend source file types.
- Run production dependency audit when a compatible lockfile and registry access exist.
- Review dynamic HTML/script execution findings manually.
- Keep secrets redacted in output and sanitize reports before sharing.
- A clean result is not proof of security; this helper is not full SAST/DAST or a penetration test.

**Evidence:** security report, scanned file count, dependency audit status, and explicitly stated exclusions/limitations.
