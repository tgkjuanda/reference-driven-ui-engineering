# Baseline Audit — v2.5.0

**Audit date:** 2026-11-05  
**Baseline branch:** `main`  
**Baseline commit:** `042616857733bab02eafc9b9532a7e249936ef14`  
**Baseline CI:** [Run 42039539523](https://github.com/tgkjuanda/reference-driven-ui-engineering/actions/runs/42039539523) — success

## Verified baseline

| Area | Observed state |
|---|---|
| Core Skill | 196 lines; below the 500-line limit |
| Progressive disclosure | Reference files are separated, but there is no task-aware router to select the minimum relevant set |
| Task routing | Work/fidelity modes are documented; no deterministic task-plan CLI exists |
| Visual evidence | Screenshot capture writes a manifest, but it does not prove that an agent visually inspected the images |
| Screenshot diagnostics | Pixel diff, heatmap, overlay, changed-pixel ratio, and normalized MAE are available |
| Accessibility | Playwright + axe-core scan is available when dependencies are configured |
| Functional regression | Guidance requires project tests, but no generic interaction contract can be inferred for an arbitrary consumer app |
| Token accounting | No provider-independent token/cost measurement exists |
| Version validation | The checker hardcodes the Skill version instead of deriving and cross-checking package metadata |

## Baseline risks

1. An agent may load more references than a task requires.
2. Repeated scans and long raw logs can consume context without adding new evidence.
3. Existing context reuse is guidance only; no route plan makes it repeatable.
4. Token savings cannot be claimed because the host runtime may not expose token/billing metrics.
5. Screenshot capture and pixel metrics do not establish perceptual inspection or design correctness.
6. Repository CI validates the Skill/tooling, not the visual and functional quality of an arbitrary consumer application.

## v2.6.0 scope

This release addresses task-aware context selection and reusable execution guidance. It deliberately does not claim to solve perceptual verification, consumer-app regression coverage, security, or performance budgets. Those require separate implementations and real target-project evidence.

## Acceptance criteria

- A deterministic planner selects references and suggested checks from declared task modes and scope.
- Creative, redesign, Figma, motion, accessibility, and responsive guidance is routed conditionally.
- The core Skill instructs agents not to preload every reference.
- The planner is covered by automated tests and CI syntax checks.
- Package and Skill versions are checked for consistency rather than manually duplicated.
- No token reduction percentage is claimed without provider/runtime measurements.
