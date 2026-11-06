# Agensi Submission Sheet — Community Edition

## Submission status

This sheet prepares the public Free Edition for an Agensi listing. It is not evidence of marketplace approval or publication. Do not submit until the live-demo section has been replaced with a genuine project run and real screenshots.

## Listing fields

**Name**

UI Reference Replication

**Summary**

Build and redesign web interfaces from screenshots, Figma exports, mockups, and wireframes—while preserving existing behavior and checking the rendered result against the reference.

**Description**

UI Reference Replication is an Agent Skill for coding agents that need to build or redesign web interfaces from visual evidence instead of generating a generic approximation.

Provide a screenshot, Figma frame export, mockup, wireframe, or publicly accessible page. The Skill guides the agent to inspect the reference and the target project before writing code. It maps the visible layout, hierarchy, typography, colors, spacing, components, assets, and states; implements the interface in the project's existing stack; and compares the rendered result against the source at matching viewports.

The Community Edition supports three work modes: New Build, Existing UI Redesign, and Hybrid. Reference-Faithful is the only design target. The source reference is treated as the visual specification; the Skill does not invent a new design direction or silently reinterpret the source.

Visual verification is a required gate. The active agent must directly inspect both the source reference and the rendered implementation. If it cannot inspect both, it must stop before modifying the project rather than claiming visual verification.

Optional helpers support project inspection, screenshot capture, screenshot-difference diagnostics, design-token validation, and an axe-core accessibility scan. These tools provide diagnostics only. Pixel metrics are not a perceptual quality score, and automated accessibility findings do not replace manual review.

The Skill does not grant browser control, terminal access, filesystem permissions, credentials, Figma access, or image perception. Helper scripts run independently, do not read sibling package files, and keep file inputs and outputs inside the selected project directory. The screenshot and accessibility helpers open the URL supplied by the user through Playwright; normal page resources may also be requested by that browser. The scripts do not read environment secrets or transmit project files to a third-party endpoint.

**Tags**

frontend, ui-design, agent-skills

**Keywords**

screenshot-to-code, reference-driven-ui, figma, ui-redesign

**Use cases**

- Build a new interface from screenshots, mockups, or Figma frame exports.
- Redesign existing UI while preserving routes, data, and workflows.
- Compare rendered screens against a supplied visual reference.

**Compatibility note**

Requires an Agent Skills-compatible coding agent that can directly inspect the supplied visual reference and rendered application. Optional screenshot capture requires Node.js 20 or later, Playwright, and a configured Chromium browser in the target project. Screenshot comparison requires Python and Pillow. The optional accessibility scan requires Playwright and axe-core. These optional tools are not prerequisites for loading the Skill; visual-inspection capability is.

## Permission and security disclosure

The package contains Markdown instructions and readable text-based scripts. When a user requests implementation, the agent may read and modify files within the selected project directory. The inspection helper reads project metadata such as package.json and directory names. The token validator reads the specified token JSON file. The screenshot comparator reads the two specified images and writes comparison images inside the project. Screenshot capture and the accessibility scan open only the URL explicitly provided for the task, through Playwright; browser-loaded page resources may make their normal network requests. Screenshot and report outputs are written inside the project.

Helper scripts reject parent-directory traversal and symlink paths that resolve outside the project root. They do not collect credentials, read environment-variable secrets, send project files to an external service, install dependencies automatically, or run background tasks. Optional dependencies must already be available in the target project.

Agensi's automated scan and manual review determine the final permission and security status. This disclosure does not pre-empt that review.

## Limitations and FAQ

**Does it work without visual input/output capability?**

No. The Skill stops before implementation when the agent cannot inspect both the source reference and rendered result.

**Does installation include Playwright, Chromium, or axe-core?**

No. These are optional dependencies of the target project. The Skill does not install dependencies silently.

**Does it guarantee pixel-perfect results?**

No. It requires evidence-based comparison and correction, but browser rendering, dynamic content, missing assets, and project constraints can prevent exact reproduction.

**Does it directly connect to Figma?**

No. It works from user-supplied frame exports, screenshots, mockups, or references the active agent is authorized and able to inspect.

**Does it redesign existing product behavior?**

No, not by default. Existing routes, features, data, permissions, APIs, validation, and workflows are preserved unless the user explicitly requests a functional change.

## Live demonstration — required before submission

Do not submit an invented or simulated result. Replace this section with a real user request and the full result of running the Skill in a project that you own or are authorized to modify and demonstrate. Include:

1. The exact request and reference source.
2. The target framework and relevant routes/screens.
3. What the agent observed in the reference before coding.
4. Files changed and the implementation outcome.
5. Source and result screenshots at the same viewport.
6. Visual differences corrected after comparison.
7. Existing flows and tests actually checked, plus any known deviations.

Use the complete result, not a summary claiming tests that were not run. Agensi's listing form recommends a detailed example of at least 700 characters.

## Pre-submission checklist

- [ ] Upload the ZIP generated by `npm run package:agensi`.
- [ ] Confirm the preview identifies exactly one Skill named UI Reference Replication.
- [ ] Review the detected file, browser, and network permissions against this disclosure.
- [ ] Replace the live-demo instructions above with a real request, full result, and genuine screenshots.
- [ ] Confirm name availability, category fields, tags, and use cases in Creator Studio.
- [ ] Submit for Agensi's automated security scan and human review.
- [ ] Do not describe the listing as approved or live until Agensi confirms that status.
