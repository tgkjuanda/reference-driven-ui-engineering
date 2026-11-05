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

## Select the work mode and fidelity mode

Work modes:
- **New build:** inspect the reference and target project, implement the new interface, and verify visual and functional quality.
- **Existing UI redesign:** read `references/existing-ui-redesign.md`; inventory current routes/features/contracts, capture baseline screenshots and run baseline tests, map the reference style to existing components, migrate incrementally, then run visual-direction and behavior-regression checks.
- **Hybrid:** identify which existing routes/components are being redesigned and which new screens are being created.

Fidelity modes:
- **Reference-Faithful:** stay close to source composition, hierarchy, components, and visual language.
- **Reference-Inspired Creative:** read `references/creative-reference-mode.md`; identify Preserve, Reinterpret, Protect, and Avoid; produce an original interpretation and evaluate against that creative direction brief rather than minimum pixel difference.

Work mode and fidelity mode are independent. For existing UI redesign, the reference determines visual direction while the current application remains the source of truth for business behavior unless the user approves functional changes.

## Consumer-project visual QA

After the preflight passes:

1. Run the project using its existing development command.
2. Capture target routes, states, and viewports with the bundled Playwright script.
3. Obtain the source visuals from the website or authorized Figma screenshot/export.
4. Inspect reference and implementation side by side, with overlays and heatmaps as supporting evidence.
5. In Reference-Faithful mode, compare visual hierarchy, geometry, typography, colors, components, assets, and motion against the source.
6. In Reference-Inspired Creative mode, review retained design anchors, originality, coherence, product fit, and consistency against the creative brief. A high pixel difference from the source is not automatically a defect.
7. Test interactions, responsive behavior, reduced-motion behavior, keyboard access, and error recovery.
8. In redesign mode, compare baseline and post-redesign behavior for navigation, forms, data views, permissions, and critical workflows.
9. Run axe-core, performance, build, type, lint, functional, and regression checks where configured.
10. Correct verified issues, recapture the exact states, and visually confirm improvements.
11. Report test evidence, intentional creative deviations, preserved functionality, unresolved differences, and anything not tested.

## Limits

- Pixel comparison is not a perceptual quality score; it is sensitive to font rendering and antialiasing.
- In Reference-Inspired Creative mode, pixel similarity is not the primary success criterion.
- axe-core catches only the issues covered by its rules and page state; manual review remains required.
- The token validator checks a supported subset, not full DTCG conformance.
- Installing the Skill does not grant browser/Figma/image-perception access.
- A CI pass for the repository does not mean visual fidelity for a consumer application has passed.
- A redesign that looks aligned but breaks existing product workflows is not complete.
