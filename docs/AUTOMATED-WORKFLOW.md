# Automated validation and QA workflow

## Repository CI

GitHub Actions runs on pushes to `main`, pull requests, and manual dispatch.

The workflow checks:
- JavaScript syntax for repository scripts.
- Node unit tests for DTCG-oriented token validation.
- Skill structure, progressive-disclosure file limit, required references, mandatory visual-capability wording, and example token validation.
- Python screenshot-diff tests including exact-match, mismatch-threshold, and size mismatch cases.
- Python syntax and Pillow setup.

These checks validate the repository and its tooling; they do not establish that a consumer UI looks or behaves correctly.

## Mandatory consumer-project visual preflight

Before any project analysis or implementation, the executing agent must prove it can visually inspect both:
- The source reference (screenshot, image, or rendered website).
- The rendered implementation screenshots for matching routes, viewports, and UI states.

When animation/effects are in scope, it must also inspect relevant recordings or sampled frames.

A screenshot file being present, a path being readable as text, DOM/CSS inspection, Figma metadata, OCR, or numerical pixel-diff output alone does not satisfy the visual-perception prerequisite.

**If the agent cannot inspect both reference and output visuals, reject the Skill for the task and stop before modifying the consumer project.** Do not silently downgrade to a text-only reconstruction.

## Consumer-project visual QA

After the preflight passes:

1. Run the project using its existing development command.
2. Capture target routes, states, and viewports with the bundled Playwright script.
3. Obtain the source visuals from the website or authorized Figma screenshot/export.
4. Inspect reference and implementation side by side, with overlays and heatmaps as supporting evidence.
5. Compare visual hierarchy, geometry, typography, colors, components, assets, and motion perceptually.
6. Test interactions, responsive behavior, reduced-motion behavior, keyboard access, and error recovery.
7. Run axe-core, performance, build, type, lint, functional, and regression checks where configured.
8. Correct verified issues, recapture the exact states, and visually confirm improvements.
9. Report test evidence, unresolved differences, and anything not tested.

## Limits

- Pixel comparison is not a perceptual quality score; it is sensitive to font rendering and antialiasing.
- axe-core catches only the issues covered by its rules and page state; manual review remains required.
- The token validator checks a supported subset, not full DTCG conformance.
- Installing the Skill does not grant browser/Figma/image-perception access.
- A CI pass for the repository does not mean visual fidelity for a consumer application has passed.
