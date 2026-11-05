---
name: ui-reference-replication
description: Build new interfaces or redesign existing applications using visual references. Supports reference-faithful replication and original reference-inspired creative design; requires direct visual perception and verifies visual, functional, responsive, accessibility, motion, and regression quality.
license: MIT
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
  version: "3.1.0"
  standard: agent-skills
---

# UI Reference Replication Engine

## Mission

Build or redesign a working interface from visual references. Support close reference reproduction and original creative interpretations inspired by references. Preserve existing product behavior by default in redesign mode. Verify the rendered result; a plausible implementation without perceptual comparison is not complete.

## Work modes

Select and report one mode before implementation:

1. **New build:** implement a new UI from the supplied reference within the existing project stack.
2. **Existing UI redesign:** restyle or restructure an existing application while preserving existing routes, features, data, permissions, and workflows by default.
3. **Hybrid:** redesign selected existing screens and build new screens only where explicitly requested.

For existing UI redesign, read `references/existing-ui-redesign.md` before modifying code.

## Fidelity modes

Select a fidelity mode independently from the work mode:

1. **Reference-Faithful:** stay close to the reference's composition, hierarchy, visual language, components, and observable interactions.
2. **Reference-Inspired Creative:** create an original interpretation that preserves selected design anchors from the reference but may reinterpret layout, component composition, exact colors, typography pairing, imagery, visual effects, and animation.

Use Reference-Inspired Creative when the user asks for a creative, similar, inspired, or non-identical result. Use Reference-Faithful when the user asks to recreate, replicate, match, or stay as close as possible to the reference. If intent is ambiguous and materially changes the result, ask one focused question.

For Reference-Inspired Creative, read `references/creative-reference-mode.md` and `references/anti-ai-slop.md`. Produce a brief with **Preserve, Reinterpret, Protect, and Avoid**, plus a product-specific design thesis and one or two signature visual devices before implementation. Complete the anti-AI-slop review before delivery. Do not use a numeric similarity percentage as the definition of creative quality.

## Mandatory visual capability prerequisite

**Read `references/visual-capability-gate.md` before doing any project analysis or implementation.**

This Skill requires the current agent to directly perceive:
- The supplied reference image/screenshot or rendered reference website.
- Screenshots of the current application and implementation at matching routes, viewports, and states.
- Motion recordings or captured animation frames when motion is in scope.

If the agent cannot visually inspect both the reference and its own rendered output, **reject the Skill for this task and stop**. Do not fall back to text-only reconstruction, DOM/CSS inspection, Figma metadata, OCR, screenshot paths, or pixel-diff numbers as a substitute for visual perception. State the missing capability and request a vision-capable agent/runtime. Do not modify the project after this prerequisite fails.

## Token-efficient execution

**Read `references/token-efficient-execution.md` before planning a task.** When the bundled planner is available, run it before loading task-specific references:

```bash
node <skill>/scripts/plan-task.mjs --work-mode <new-build|existing-redesign|hybrid> --fidelity <reference-faithful|reference-inspired-creative>
```

Read only the references under **Read before implementation**. Load conditional references only when their subject is in scope. Do not preload the full reference library, repeat verified scans, or paste full logs into context. Preserve mandatory visual, functional, accessibility, and regression checks; token efficiency must come from targeted context and deterministic automation, not skipped verification. Never claim a token/cost reduction without reliable runtime measurements.

## Portability

This is a vendor-neutral Agent Skill. Use the host agent's available browser, Figma, filesystem, terminal, and testing tools. Detect actual capabilities; never assume a tool exists or invent a tool call. The Skill does not grant credentials, browser access, Figma permissions, write access, or image/video perception.

Read the bundled references as needed:
- `references/token-efficient-execution.md` for task-aware context loading and bounded execution.
- `references/complete-quality-assurance.md` for responsive, performance, dependency-security, and unified quality-report gates.
- `references/design-intelligence.md` for scoped Figma variables/components mapping and drift validation.
- `references/visual-capability-gate.md` for the mandatory vision prerequisite and rejection behavior.
- `references/creative-reference-mode.md` for original designs inspired by a visual reference.
- `references/anti-ai-slop.md` for product-specific visual originality, restraint, anti-template checks, and the required de-slop review.
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
2. **Reference-centered:** respect the user's selected fidelity mode. Do not enforce literal replication when creative interpretation was requested.
3. **Existing behavior is protected:** in redesign mode, preserve routes, features, data, permissions, APIs, validation, and business workflows unless the user explicitly approves a change.
4. **Evidence-led:** distinguish inspected facts, measurements, estimates, and unknowns.
5. **No fabricated access:** never claim to inspect hidden Figma frames, private pages, assets, styles, or visual output that were not accessible.
6. **Preserve the project:** inspect the current stack, dependencies, routing, components, and conventions before editing.
7. **Consistency:** use canonical design tokens and reusable components; document justified exceptions.
8. **Accessible by construction:** target WCAG 2.2 AA for applicable criteria. Do not reproduce accessibility defects just because they appear in the reference.
9. **Responsive by evidence:** follow supplied responsive frames first; otherwise document inferred behavior and test representative widths.
10. **Functional feedback:** interactive controls need perceivable states, validation, and recovery behavior.
11. **Intentional motion:** reconstruct or reinterpret supported motion and effects with reusable tokens, a clear purpose, reduced-motion behavior, and performance checks.
12. **Verify, then claim:** only report tests that actually ran. Do not claim pixel-perfect, perceptually verified, WCAG-compliant, or fully tested without evidence.
13. **Respect rights and access:** use authorized reference assets. Do not bypass authentication, paywalls, or licensing restrictions.
14. **Reject generic AI aesthetics:** in creative mode, do not stack fashionable effects or reuse interchangeable page templates without a product-specific reason. Follow `references/anti-ai-slop.md`; justify major visual decisions by product context, user task, or reference evidence.
15. **Complete and evidence the quality report:** do not claim delivery-wide pass unless all required task-specific gates have valid evidence. Use `references/complete-quality-assurance.md`; report untested checks explicitly.

## Operating workflow

### 1. Visual capability preflight

Run the mandatory visual capability gate first. Confirm that the model can inspect reference and implementation visuals in the current session. Confirm visual access to animation recordings/frames when motion is in scope. If any mandatory visual input or output cannot be perceived, reject and stop before project changes.

### 2. Intake and mode selection

Select one work mode and one fidelity mode. Record target routes/screens, reference scope, viewport sizes, expected interactions, and what must remain unchanged.

- If the user requests creative inspiration or a non-identical design, choose Reference-Inspired Creative.
- If the user requests close replication, choose Reference-Faithful.
- If the request is ambiguous and the distinction materially affects the output, ask one focused question.
- In redesign mode, complete the baseline and migration workflow in `references/existing-ui-redesign.md`.

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
- In Reference-Inspired Creative mode, a creative direction brief identifying what to preserve, reinterpret, protect, and avoid.
- In Reference-Inspired Creative mode, an anti-slop review identifying product-specific signature choices and removing generic or unjustified treatments.

Record sources and confidence for inferred values. Static screenshots establish appearance, not animation timing. Inspect live behavior or recordings for motion.

### 5. Plan and implement

Implement in this order:
1. Protect and document existing product contracts when in redesign mode.
2. Establish the selected fidelity mode and creative direction brief when relevant.
3. Canonical design and motion tokens, grounded in the creative thesis where relevant.
4. Application shell and macro layout.
5. Shared components and variants.
6. Screen content and authorized assets.
7. Interaction behavior and feedback states.
8. Motion and visual effects, using a consistent motion system.
9. Responsive adaptations and reduced-motion alternatives.
10. Accessibility semantics and keyboard behavior.

Follow the existing project's framework and conventions. Do not introduce unrelated visual elements, arbitrary gradients, generic stock imagery, emoji icons, or unrequested redesigns. Do not duplicate components for superficial differences. Do not add a motion library unless the existing stack cannot meet the required behavior cleanly.

In Reference-Inspired Creative mode, optimize for recognizable design anchors, originality, coherence, and product fit—not minimum pixel difference. Apply the de-slop review: remove interchangeable templates, repetitive card grids, trend stacking, decorative badges, generic filler imagery/copy, and unjustified effects. Every major signature treatment must have a product, user, brand, or reference rationale. Do not copy proprietary logos, illustrations, distinctive brand identifiers, or other protected assets without authorization.

In redesign mode, use small reversible changes, preserve component/data/API contracts, and do not delete or disable existing functionality simply because it is absent from the reference. Any requested functional change must be identified separately and approved.

### 6. Run the QA toolkit

Scripts live beside this file in `scripts/`. Run them from the user's project root where required.

- `node <skill>/scripts/inspect-project.mjs --root .`
- `node <skill>/scripts/validate-tokens.mjs <path-to-token-json>`
- `node <skill>/scripts/capture-screenshots.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference`
- `node <skill>/scripts/validate-visual-evidence.mjs --file artifacts/ui-reference/visual-evidence.json --root .`
- `node <skill>/scripts/validate-visual-review.mjs --file artifacts/ui-reference/visual-review.json --evidence artifacts/ui-reference/visual-evidence.json --root .
- `node <skill>/scripts/run-responsive-audit.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference/responsive.json`
- `node <skill>/scripts/run-performance-audit.mjs --url http://localhost:3000 --budget artifacts/ui-reference/performance-budget.json --out artifacts/ui-reference/performance.json`
- `node <skill>/scripts/run-dependency-audit.mjs --root . --fail-on high --out artifacts/ui-reference/dependency-audit.json`
- `node <skill>/scripts/validate-quality-report.mjs --file artifacts/ui-reference/quality-report.json --root .
- `node <skill>/scripts/validate-design-map.mjs --file artifacts/ui-reference/figma-code-map.json --root .```
- `node <skill>/scripts/run-functional-regression.mjs --config <regression-config.json> --label baseline --out artifacts/ui-reference/baseline.json`
- `node <skill>/scripts/compare-regression.mjs --baseline artifacts/ui-reference/baseline.json --actual artifacts/ui-reference/post-redesign.json`
- `python <skill>/scripts/compare-screenshots.py reference.png actual.png --diff artifacts/ui-reference/diff.png`
- `node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000`

The browser scripts require Playwright in the project/runtime. Accessibility audit additionally requires axe-core. In redesign mode, run the existing project's baseline and post-change regression tests. For motion, inspect actual key transitions and test the reduced-motion preference; use browser recording/performance tools when needed. Screenshot files must be visually accessible to the agent, not merely saved on disk. If dependencies are absent, state the blocker and provide the exact setup command; never silently install packages.

### 7. Visual correction and regression loop

Compare reference and implementation at identical viewport, route, scroll position, and UI state. Inspect side-by-side screenshots and overlays perceptually; use pixel heatmaps as supporting diagnostics, not as a replacement for visual judgment.

- In Reference-Faithful mode, correct the highest-impact deviations from the source design.
- In Reference-Inspired Creative mode, compare the output against the creative direction brief. Verify that selected design anchors remain recognizable, the interpretation is original and coherent, and the design fits the target product. A high pixel difference from the source is not automatically a defect.
- In existing UI redesign mode, also verify existing routes, features, data, permissions, APIs, forms, interactions, and workflows.

Map discrepancies to responsible components/tokens, change the smallest responsible code surface, re-capture, and visually confirm improvement without regression. Keep a defect log with severity, evidence, correction, and retest result.

### 8. Functional regression execution

For existing UI redesign and hybrid work, define explicit functional checks from the application's real routes and workflows using `templates/functional-regression.example.json`. Run the same checks before and after implementation, saving separate baseline and post-redesign reports:

```bash
npm run regression -- --config tests/ui-regression.json --label baseline --out artifacts/ui-reference/baseline.json
npm run regression -- --config tests/ui-regression.json --label post-redesign --out artifacts/ui-reference/post-redesign.json
npm run compare:regression -- --baseline artifacts/ui-reference/baseline.json --actual artifacts/ui-reference/post-redesign.json --out artifacts/ui-reference/regression-comparison.json
```

The Playwright runner executes only declared route and interaction steps. It does not infer undocumented product behavior. Compare reports to identify regressions, resolved failures, pre-existing failures, missing baseline coverage, and failing new checks. A no-new-regressions result must not be reported as a fully passing test suite when pre-existing failures remain.

### 9. Perceptual visual review

For significant visual comparisons, create a scorecard from `templates/perceptual-visual-review.example.json` and validate it against the capture IDs in the visual evidence manifest:

```bash
npm run validate:visual-review -- --file artifacts/ui-reference/visual-review.json --evidence artifacts/ui-reference/visual-evidence.json --root .
```

Reference-Faithful reviews require geometry, hierarchy, typography, spacing, color, components, responsive, composition, and reference-fidelity dimensions. Reference-Inspired Creative reviews require the shared dimensions plus design anchors, product fit, originality, and anti-slop. A partial, failed, or untested dimension cannot produce a passing gate. Do not collapse the review into a single numeric score.

The scorecard is an agent-declared assessment. It structures findings and ties them to evidence; it does not prove image perception or independently calculate design quality.

### 10. Visual evidence validation

For screenshot comparisons used as delivery evidence, maintain a manifest based on `templates/visual-evidence.example.json` and validate it with `scripts/validate-visual-evidence.mjs`. Include matching reference/implementation PNG pairs, route, state, viewport, image hashes, reviewer declaration, and visual findings. A structurally valid manifest is not proof of actual visual perception; never misrepresent the declared review as machine-verified understanding.

### 11. Delivery report

Report work mode, fidelity mode, creative direction brief and anti-slop review when applicable, routes/screens covered, files changed, reference limitations, current behavior preserved, approved functional changes, intentional creative deviations, design and motion tokens/components reused, interactions and animations implemented, viewports and motion preferences tested, screenshot/recording evidence visually inspected, baseline vs post-change test results, visual-diff diagnostics, accessibility findings, performance observations, and unresolved deviations.

### 12. Unified quality report

Create a report from the quality-report template. Every required gate must be Pass, Partial, Fail, or Not Tested. Pass requires an existing evidence file; Partial/Fail require a next action; Not Tested requires a reason. Validate the report with validate-quality-report.mjs. This checks report structure and referenced files, not the truth of an agent declaration.

### 13. Design intelligence and Figma mapping

When structured Figma access is part of scope, create a scoped Figma-to-code map for selected variables, components, variants, and implementation paths. Validate it against project files. Unmapped records or drift must remain Partial; a missing mapped source or invalid path fails the gate. The validator does not independently connect to Figma or prove visual synchronization.

## Required quality gates

Give every gate one status: **Pass**, **Partial**, **Fail**, or **Not tested**.

1. Mandatory visual perception of both reference and implementation.
2. Reference intent and fidelity-mode alignment.
3. Design-token integrity and consistency.
4. Component reuse and state coverage.
5. Responsive behavior and overflow.
6. Keyboard, semantics, contrast, and WCAG 2.2 AA review.
7. Feedback, validation, prevention, and recovery.
8. Build, runtime, and regression checks.
9. Figma-to-code mapping and drift, or a clear statement that structured Figma access was unavailable.
10. Motion behavior, visual effects, reduced-motion alternatives, and motion performance.
11. In redesign mode: preservation of existing routes, features, data/API contracts, permissions, and critical workflows.
12. In Reference-Inspired Creative mode: preservation of selected design anchors, originality, coherence, and product fit.
13. Responsive audit across declared representative routes and viewports.
14. Performance budget review using recorded browser lab metrics and documented limitations.
15. Dependency advisory audit where the target package manager and lockfile permit it; other security review remains explicitly scoped.
16. Unified quality report with evidence-backed status for every required gate.
17. For Figma-scoped tasks, design-intelligence mapping and drift report validated against the project files.

Gate 1 is a hard prerequisite. If it fails, reject and stop; do not mark the rest of the gates as passed or imply the task was completed. In redesign mode, gate 11 must have baseline and post-change evidence. Do not collapse failed or untested gates into a global pass.

## Iteration stop condition

Continue fixing the highest-impact visually verified discrepancy while the expected benefit is meaningful and tools/evidence permit. Stop only when the agreed tolerance is met, remaining issues are documented, or a specific access/tooling limitation blocks further work. Stop and request user approval before any unrequested change to business logic, data contracts, permissions, APIs, or destructive functionality. Never invent a numeric similarity/fidelity score from subjective review.
