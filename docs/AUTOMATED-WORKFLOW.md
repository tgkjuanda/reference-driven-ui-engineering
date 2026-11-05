# Automated validation and QA workflow

## Repository CI

GitHub Actions runs on pushes to `main`, pull requests, and manual dispatch.

The workflow checks:
- JavaScript syntax for repository scripts.
- Node unit tests for DTCG-oriented token validation.
- Skill structure, progressive-disclosure file limit, required references, and example token validation.
- Python screenshot-diff tests including exact-match, mismatch-threshold, and size mismatch cases.
- Python syntax and Pillow setup.

## Consumer-project visual QA

The repository CI cannot prove visual fidelity for every project because the consumer application, reference URL, and screenshots are project-specific. In the consumer project:

1. Run the project using its existing development command.
2. Capture target routes and viewports with the bundled Playwright script.
3. Obtain the source screenshot from the website or authorized Figma screenshot/export.
4. Compare source and implementation using raw diff, heatmap, and overlay.
5. Use the Agent-driven correction loop documented in `references/visual-qa.md`.
6. Run the axe-core audit and manual keyboard review.
7. Re-run build, type, lint, functional, responsive, and accessibility checks after changes.

## Limits

- Pixel comparison is not a perceptual quality score; it is sensitive to font rendering and antialiasing.
- axe-core catches only the issues covered by its rules and page state; manual review remains required.
- The token validator checks a supported subset, not full DTCG conformance.
- No browser/Figma access is granted by installing the skill.
