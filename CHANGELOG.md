# Changelog

## [3.1.0] - 2026-11-05

### Added
- Figma-to-code mapping validator for scoped Figma variables, component identifiers, variants, implementation paths, and drift lists.
- Design Intelligence reference for mapping only task-relevant design data and reusing verified mappings.
- Unit tests covering valid mappings, drift, missing code references, missing files, and path traversal.

### Changed
- Figma-scoped task plans now include design mapping validation.
- Documentation distinguishes file-level mapping validation from live Figma synchronization and visual verification.


## [3.0.0] - 2026-11-05

### Added
- Responsive audit for viewport matrices, document overflow, mobile viewport metadata, navigation failures, and uncaught page errors.
- Browser lab performance budget audit for TTFB, FCP, LCP, CLS, observed long-task blocking time, and resource transfer sizes.
- npm dependency advisory audit with configurable severity threshold and no automatic dependency changes.
- Unified quality report validator with conditional gates, evidence-file checks, path containment, and Pass/Partial/Fail/Not Tested semantics.
- Templates and unit tests for responsive, performance, dependency-security, and aggregate quality reporting.

### Changed
- Full task plans now route to responsive, accessibility, performance, dependency-security, and unified-report checks.
- Reports distinguish browser lab measurements and dependency advisories from field Core Web Vitals and full security audits.


## [2.9.0] - 2026-11-05

### Added
- Perceptual visual review scorecard with dimension-level requirements for Reference-Faithful and Reference-Inspired Creative modes.
- Validator that cross-references capture IDs, routes, and states from the visual evidence manifest.
- Explicit Pass, Partial, Fail, and Not Tested reporting; missing dimensions and incomplete findings fail validation.
- Unit tests for missing dimensions, partial states, creative-mode requirements, and evidence-reference mismatches.

### Changed
- Visual QA now requires dimension-level assessment instead of a single subjective quality score.
- Documentation emphasizes that the scorecard is agent-declared and does not prove visual perception or correctness.


## [2.8.0] - 2026-11-05

### Added
- Playwright functional regression runner driven by an explicit project-owned route and interaction config.
- Baseline/post-redesign report comparator that identifies new regressions, missing baseline checks, failed new checks, resolved failures, and pre-existing failures.
- Example functional test config and unit tests for config validation and report comparison.

### Changed
- Existing UI Redesign workflow now requires identical declared checks before and after migration when a runnable browser environment exists.
- Reports distinguish no-new-regressions from a fully passing test suite.
- Task planner routes baseline, post-redesign, and comparison commands for functional tasks.


## [2.7.0] - 2026-11-05

### Added
- Structured visual evidence manifest template with route, state, viewport, reference/output pair, reviewer declaration, and findings.
- Dependency-free visual evidence validator checking path containment, file existence, PNG headers, dimensions, duplicate IDs, review completeness, and SHA-256 hashes.
- Unit tests for valid evidence, missing review, dimension mismatch, and path traversal.

### Changed
- Visual QA and delivery workflow require a validated evidence package for significant screenshot comparisons.
- Explicitly distinguishes manifest integrity and agent-declared review from independently proven image perception.


## [2.6.0] - 2026-11-05

### Added
- Token-efficient execution policy for progressive context loading, task-specific reference routing, context reuse, deterministic automation, compact evidence, and bounded iteration.
- Dependency-free task planner CLI for work modes, fidelity modes, Figma, motion, accessibility, responsive scope, and suggested checks.
- Automated planner tests and CI syntax validation.
- Baseline audit of v2.5.0 with verified limitations and v2.6 acceptance criteria.

### Changed
- Core Skill now instructs agents to run the task planner and avoid preloading the entire reference library.
- Version checker cross-validates package.json and SKILL.md semantic versions instead of hardcoding a release number.
- QA, workflow, and README documentation now explain token-efficient context selection.
- No token savings percentage is claimed; runtime/provider measurements are required for cost claims.


All notable changes to UI Reference Replication are documented here.

The project follows a practical versioning scheme for its Agent Skill and bundled QA tooling. Versions below describe repository changes; they do not imply that every external agent/runtime or consumer application has been independently tested.

## [2.5.0] - 2026-11-05

### Added
- Anti-AI-Slop and Design Originality guide.
- Product-specific design thesis requirement for creative mode.
- De-slop review covering generic templates, repetitive card layouts, trend stacking, decorative badges, filler assets/copy, fabricated metrics/testimonials/logos, and unjustified effects.
- Element-level rationale for major visual decisions.
- Anti-slop quality gate in the project scorecard.
- Repository checker assertions for the anti-slop guide and its required use in creative mode.

### Changed
- Creative mode now explicitly requires the anti-AI-slop review before delivery.
- README reorganized around capabilities, work modes, fidelity modes, installation, examples, QA, limitations, and documentation.
- Broken/unverified skills.sh listing badge omitted from README; the GitHub Actions and MIT badges remain.

## [2.4.0] - 2026-11-05

### Added
- Reference-Inspired Creative fidelity mode, independent from work mode.
- Creative direction brief with Preserve, Reinterpret, Protect, and Avoid.
- Creative evaluation based on retained design anchors, originality, coherence, and product fit rather than minimum pixel difference.
- Quality gate and workflow guidance for creative interpretation.

## [2.3.0] - 2026-11-05

### Added
- Existing UI Redesign work mode for transforming an existing application using a visual reference.
- Baseline inventory for routes, permissions, forms, APIs, data views, states, and critical workflows.
- Reference-to-existing-component migration map.
- Controlled migration and regression verification guidance.

### Changed
- Explicitly protects existing product behavior, data/API contracts, permissions, and business rules unless the user approves functional changes.

## [2.2.0] - 2026-11-05

### Added
- Mandatory Visual Capability Gate.
- Explicit rejection behavior for agents that cannot directly inspect both the source reference and rendered implementation.
- Visual-perception quality gate and CI checks for required gate documentation.

### Changed
- Clarified that agent-platform installation support does not prove model/runtime visual capability.

## [2.1.0] - 2026-11-05

### Added
- Motion Design, Effects, and Animation Engineering reference.
- Motion inventory for triggers, timing, easing, sequencing, interruption, responsive behavior, and reduced-motion alternatives.
- Motion tokens, performance guidance, and motion QA protocol.
- Motion/effects quality gate.

## [2.0.0] - 2026-11-05

### Added
- Refactored core Skill for progressive disclosure.
- Design system engineering, Figma analysis, responsive/interaction, accessibility, and visual QA references.
- Project inspection, token validation, screenshot capture, screenshot comparison, and axe-core audit scripts.
- Node and Python tests plus GitHub Actions validation workflow.
- Automated workflow, quality gate, agent compatibility, and launch documentation.

### Changed
- Established evidence-led implementation and explicit reporting of limitations and untested checks.

## [1.2.0] - Earlier release

### Added
- Expanded UI/UX quality principles covering consistency, accessibility, responsive behavior, visual hierarchy, error prevention/recovery, design tokens, component-driven development, and Figma-to-code mapping.
- WCAG 2.2 AA target and DTCG-oriented token guidance.

## [1.0.0] - Initial release

### Added
- Initial UI Reference Replication Agent Skill for reconstructing interfaces from visual references.
- Core instructions and supporting reference material.
