# Agensi Submission Sheet — Community Edition

## Submission status

The Community Edition package is structurally prepared and has passed the repository's latest CI validation. This document is a listing-preparation sheet; it is not evidence of Agensi approval or publication. Submit only after the live demonstration section below contains a real run from a target project.

## Listing fields

**Name**

UI Reference Replication

**Summary**

Build and redesign web interfaces from screenshots, Figma exports, mockups, and wireframes—while preserving existing behavior and checking the rendered result against the reference.

**Description**

UI Reference Replication is an Agent Skill for coding agents that need to build or redesign a web interface from visual evidence instead of generating a generic approximation.

Provide a screenshot, Figma frame export, mockup, wireframe, or publicly accessible page. The Skill guides the agent to inspect the reference and the target project before writing code. It then maps the visible layout, hierarchy, typography, colors, spacing, components, assets, and states; implements the interface in the project's existing stack; and compares the rendered result against the source at matching viewports.

The Community Edition supports three work modes:

- New Build: create a new interface from the supplied reference.
- Existing UI Redesign: update the visual layer while preserving routes, features, data, permissions, APIs, validation, and workflows by default.
- Hybrid: redesign selected existing screens and build new screens where requested.

Reference-Faithful is the only design target in this edition. The source reference is treated as the visual specification. The Skill does not invent a new design direction or silently reinterpret the source. Material deviations must be explained by a product constraint, accessibility requirement, technical limitation, or missing evidence.

Visual verification is a required workflow gate. The active agent must directly inspect both the source reference and the rendered implementation. If it cannot inspect both, it must stop before modifying the project rather than claiming that a text-only reconstruction was visually verified.

Optional helpers support project inspection, screenshot capture, screenshot difference diagnostics, design-token validation, and an axe-core accessibility scan. These tools provide diagnostics only. Pixel metrics are not a perceptual quality score, and automated accessibility findings do not replace manual review.

This Skill does not grant browser control, terminal access, filesystem permissions, credentials, Figma access, or image perception. Helper scripts require the target project's own runtime and optional dependencies. The agent must report only the checks it actually performed.

**Tags**

frontend, ui-design, agent-skills

**Keywords**

screenshot-to-code, reference-driven-ui, figma, ui-redesign

**Use cases**

- Build a new interface from screenshots, mockups, or Figma frame exports.
- Redesign existing UI while preserving routes, data, and workflows.
- Compare rendered screens against a supplied visual reference.

**Compatibility note**

Requires an Agent Skills-compatible coding agent that can directly inspect the supplied visual reference and the rendered application. For optional screenshot capture, the target project needs Node.js 20 or later, Playwright, and a configured Chromium browser. The screenshot comparison helper requires Python and Pillow. The optional accessibility scan requires Playwright and axe-core. These helpers are not prerequisites for loading the Skill; the visual-inspection capability is.

## Permissions and security disclosure

The package contains text instructions and small text-based helper scripts. The workflow may read and modify files in the target project when the user requests an implementation. The screenshot and accessibility helpers open only the URL explicitly supplied by the user, typically a local development server, through the project's Playwright browser. Screenshot and report outputs are written to the target project's selected output directory.

The helpers do not collect credentials, read environment variables, transmit project files to a third-party endpoint, or run background jobs. Agensi's automated scan and human review make the final permission and security determination; this document does not pre-empt that review.

## Limitations and FAQ

**Does it work without visual input/output capability?**

No. The Skill stops before implementation when the agent cannot inspect both the source reference and the rendered result.

**Does installation include Playwright, Chromium, or axe-core?**

No. They are optional dependencies of the target project. The Skill does not install dependencies silently.

**Does the Skill guarantee pixel-perfect results?**

No. It requires evidence-based visual comparison and correction, but browser rendering, dynamic content, missing assets, and project constraints can prevent exact reproduction.

**Does it directly connect to Figma?**

No. It works from user-supplied frame exports, screenshots, mockups, or references that the active agent is authorized and able to inspect.

**Does the Skill redesign existing product behavior?**

No, not by default. Existing routes, features, data, permissions, APIs, validation, and workflows are preserved unless the user explicitly requests a functional change.

## Live demonstration — required before submission

Do not submit an invented or simulated result as a real demonstration. Agensi's listing form asks for a real request and its full result; use an actual run from a project where the user has permission to modify the code and share the screenshots.

Capture the following in the final listing's demonstration field (Agensi recommends a detailed example of 700+ characters):

1. The exact user request and the reference source used.
2. The target project's framework and the relevant screens/routes.
3. The observed reference details before implementation.
4. The implementation outcome and the files actually changed.
5. Screenshots of reference and result at the same viewport.
6. The visual differences corrected after comparison.
7. Existing flows and tests actually checked, plus any known deviations.

Replace this section with the real request and complete result before submitting.

## Pre-submission checklist

- [ ] Upload the ZIP generated by `npm run package:agensi`.
- [ ] Confirm the Agensi preview shows one Skill named UI Reference Replication.
- [ ] Review detected file, browser, and network permissions against the disclosure above.
- [ ] Replace the live-demonstration instructions with a real request and result.
- [ ] Confirm name availability and complete the category fields in Creator Studio.
- [ ] Submit for Agensi's automated security scan and manual review.
- [ ] Do not describe the listing as approved or live until Agensi confirms that status.
