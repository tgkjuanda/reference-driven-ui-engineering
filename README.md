# UI Reference Replication

[![Validate Agent Skill](https://github.com/tgkjuanda/reference-driven-ui-engineering/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/reference-driven-ui-engineering/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Build the interface shown in the reference—not a generic approximation.**

UI Reference Replication is an open Agent Skill for coding agents. It helps create or redesign web interfaces from screenshots, reference images, Figma frame exports, public website pages, mockups, and wireframes. Its Community Edition has one clear objective: reproduce the supplied visual reference as faithfully as the available evidence allows.

## What it does

- Inspects the visual reference before implementation.
- Builds new interfaces or redesigns existing screens in the target project's stack.
- Matches layout, hierarchy, typography, color, spacing, components, and visible states.
- Uses reusable components and reference-derived design tokens.
- Protects existing routes, functionality, data, and workflows during visual redesigns.
- Captures screenshots and supports side-by-side visual comparison.
- Checks basic responsive behavior and accessible interaction patterns.

## One fidelity target: Reference-Faithful

The reference is the visual specification. The Skill does not invent a new design direction or freely reinterpret the source. Material deviations must be caused by a documented product constraint, accessibility requirement, technical limitation, or missing reference evidence.

The Community Edition supports three work modes:

| Work mode | Purpose |
|---|---|
| **New Build** | Create a new interface from a supplied reference. |
| **Existing UI Redesign** | Update an application's visual layer while preserving its behavior. |
| **Hybrid** | Redesign selected screens and build new screens in the same project. |

## Visual inspection is mandatory

The active agent must be able to inspect both the source reference and screenshots of its implementation. Text-only reconstruction, DOM/CSS inspection, OCR, or pixel-difference metrics cannot replace visual inspection.

If the agent cannot see both sets of visuals, it must stop before modifying the project and state the missing capability.

## How the workflow works

1. Confirm visual access to the reference and implementation.
2. Inspect the target project's framework, routes, components, and conventions.
3. Map the reference's layout, hierarchy, typography, color, spacing, components, and visible states.
4. Implement the interface in the existing project stack.
5. Capture matching screenshots and inspect them side by side.
6. Correct the largest verified visual differences.
7. Check existing functionality, responsive behavior, and basic accessibility.
8. Report what was verified and what remains unresolved.

## Installation

Install with the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

~~~bash
npx skills add tgkjuanda/reference-driven-ui-engineering
~~~

The CLI can install the Skill into supported Agent Skills-compatible tools. Use its interactive selector for the agents available in your environment.

For Antigravity, the repository also includes an always-on workspace rule at `.agents/rules/ui-reference-replication.md`. Install the Skill and the routing rule separately; see [Agent installation](docs/AGENT-COMPATIBILITY.md).

## Quick start

In a vision-capable coding agent, provide a reference image or URL and invoke the Skill:

~~~text
@ui-reference-replication

WORK MODE: NEW BUILD

Build this interface from the supplied reference.
Treat the reference as the source of truth. Match its layout,
hierarchy, typography, colors, spacing, components, and visible
states as closely as the evidence allows.

Use the target project's existing framework and conventions.
Inspect the reference before coding. Capture the result at the
same viewport, inspect both images side by side, correct the
largest verified differences, and report what was tested.
~~~

For an existing application:

~~~text
@ui-reference-replication

WORK MODE: EXISTING UI REDESIGN

Use the supplied reference to update the visual design.
Preserve all existing routes, features, data, permissions,
validation, APIs, and business workflows unless I explicitly
approve a functional change.

Record the current state before editing. After implementation,
inspect matching screenshots and verify the existing workflows.
~~~

## Basic QA toolkit

The repository includes small, optional helpers:

| Helper | Purpose |
|---|---|
| Project inspection | Identifies the framework, package scripts, and available tooling. |
| Screenshot capture | Captures specified routes at matching viewport sizes with Playwright. |
| Screenshot comparison | Produces a difference image, heatmap, and overlay for diagnosis. |
| Token validation | Checks the supported subset used by the example design-token file. |
| Accessibility scan | Runs axe-core when the target project has the required dependencies. |

Run repository checks:

~~~bash
npm test
npm run check
npm run validate:tokens
~~~

See [Quality Gates](docs/QUALITY-GATES.md) and [Automated Workflow](docs/AUTOMATED-WORKFLOW.md) for the Community Edition's acceptance criteria.

## Scope

This edition focuses on faithful reference implementation and essential visual verification. It does not include original creative-direction workflows, structured Figma-to-code intelligence, motion-design engineering, benchmark tooling, or the extended automated QA/reporting suite.

The scripts are optional diagnostics. A passing repository test does not prove that an interface built in another project is visually accurate or functionally correct.

## Version

Current Community Edition: **4.0.0**. Changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## License

The Community Edition is licensed under [MIT](LICENSE). This license applies to the code and documentation in this repository; third-party reference designs and assets remain subject to their own rights and licenses.
