# Community Edition Workflow and Validation

## Repository CI

GitHub Actions runs on pushes to `main`, pull requests, and manual dispatch. It checks:
- JavaScript syntax for the Community Edition's remaining helper scripts.
- Node unit tests.
- Skill structure, version consistency, required files, and edition scope.
- Screenshot-difference helper tests.
- Python syntax for the screenshot comparison script.

A passing repository workflow validates the Skill package and helpers. It does not validate a consumer application's visual quality.

## Consumer-project workflow

1. Confirm that the current agent can directly inspect the source reference and the rendered implementation. Stop if not.
2. Inspect the target project's framework, routes, components, design tokens, and current behavior.
3. Record the work mode: New Build, Existing UI Redesign, or Hybrid.
4. Analyze the source reference's observable geometry, hierarchy, typography, color, spacing, components, assets, and UI states.
5. Implement within the existing stack and preserve existing product behavior during redesigns.
6. Capture screenshots for matching routes and viewports.
7. Inspect source and implementation side by side. Correct the largest confirmed visual gaps.
8. Check representative responsive widths, important interactions, keyboard behavior, and accessible labels/focus.
9. Run the project's existing tests and report their actual results.
10. Deliver a concise record of changed files, visual checks, preserved behavior, deviations, and unresolved items.

## Optional helper commands

Run these from the target project root when their prerequisites are available:

```bash
node <skill>/scripts/inspect-project.mjs --root .
node <skill>/scripts/capture-screenshots.mjs --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference
python <skill>/scripts/compare-screenshots.py reference.png actual.png --diff artifacts/ui-reference/diff.png
node <skill>/scripts/validate-tokens.mjs path/to/design-tokens.json
node <skill>/scripts/accessibility-audit.mjs --url http://localhost:3000
```

The screenshot and accessibility helpers require their respective browser/project dependencies. Do not install packages without approval. Pixel metrics can locate differences but cannot judge visual quality. Automated accessibility results do not replace manual keyboard, focus, and content checks.

## Scope boundary

This Community Edition keeps reference-faithful implementation and essential visual checks. Advanced creative direction, structured Figma intelligence, motion engineering, benchmarking, agent capability certification, and extended automated QA reporting are not part of this package.
