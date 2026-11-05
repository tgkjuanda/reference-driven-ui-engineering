# UI Reference Replication Engine

[![skills.sh](https://skills.sh/b/tgkjuanda/ui-reference-replication)](https://skills.sh/tgkjuanda/ui-reference-replication)
[![Validate Agent Skill](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Rebuild UI from references, then verify the result.**

A cross-agent Agent Skill that helps turn Figma files, live websites, and screenshots into responsive, accessible frontend implementations — then checks the result with visual-diff and accessibility tooling when configured.

The core idea: **a UI that looks plausible is not necessarily a UI that matches the reference.** This Skill makes the coding agent inspect the design and existing project first, extract its design system, implement in the current stack, and report what was actually verified.

## Install

Requires Node.js 22.20+ for the current Vercel Skills CLI.

```bash
npx skills add tgkjuanda/ui-reference-replication
```

Install explicitly to Antigravity, Claude Code, and OpenCode:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

Use the Skills CLI's interactive agent picker for other supported agents. Installation copies the Skill; it does not automatically grant Figma, browser, terminal, or local-project permissions.

## Use it

In your coding agent, invoke `@ui-reference-replication` and provide a Figma/website URL or attach a screenshot:

```text
@ui-reference-replication

Rebuild this reference in the current project:
https://www.figma.com/design/...

Inspect the reference and this codebase before coding.
Preserve the existing stack. Extract tokens and components.
Implement responsive and interaction states. Capture screenshots,
compare them with the reference, fix verified differences, and
report test results and remaining gaps.
```

## What it does

- **Reference intelligence:** inspect Figma frames, website layouts, screenshots, typography, assets, and component structure.
- **Design system:** map semantic design tokens, visual hierarchy, and reusable variants.
- **Frontend implementation:** work within the existing React, Next.js, Vue, or other project stack.
- **Interaction quality:** define loading, empty, success, disabled, validation, and error-recovery states.
- **Responsive QA:** capture representative or source-supplied viewport sizes.
- **Visual QA:** capture Playwright screenshots and generate raw diff, heatmap, and overlay artifacts.
- **Accessibility QA:** run axe-core checks when configured; manual keyboard and assistive-technology checks remain necessary.
- **Engineering checks:** validate a supported subset of DTCG token values and run repository regression tests.

## QA toolkit

Repository checks:

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md) for browser and accessibility setup, and [Figma MCP Integration](skills/ui-reference-replication/references/figma-analysis.md) for structured design extraction.

## Runtime requirements and limitations

The Skill does not provide browser/Figma access by itself.

- Screenshot capture: Playwright and Chromium in the target project/runtime.
- Accessibility scan: Playwright and axe-core.
- Pixel diff: Python and Pillow.
- Structured Figma analysis: an authorized Figma MCP/API connection.
- Code Connect: configured Figma-to-code mappings in the relevant project.

Pixel differences are diagnostic, not a complete perceptual-quality score. axe-core is not a full WCAG conformance audit. The token validator checks a useful subset, not every DTCG composite type or reference form. If a capability is missing, the agent must disclose it rather than claim the check passed.

## Quality standards

- Reference-centered, component-driven, and token-based implementation.
- WCAG 2.2 AA as a target for applicable criteria — not a certification claim.
- DTCG Format Module 2025.10 as a portable token interchange target — the validator is partial.
- Per-gate status: Pass, Partial, Fail, or Not tested.

## Documentation

- [Quality Gates](docs/QUALITY-GATES.md)
- [Agent Compatibility](docs/AGENT-COMPATIBILITY.md)
- [Automated Workflow](docs/AUTOMATED-WORKFLOW.md)
- [Launch Kit and Promotion Plan](docs/LAUNCH-KIT.md)
- [Reference Analysis](skills/ui-reference-replication/references/figma-analysis.md)

## Contributing

Bug reports, agent compatibility results, reproducible before/after screenshots, and improvements to the QA scripts are welcome. See [Issues](https://github.com/tgkjuanda/ui-reference-replication/issues).

## License

MIT for this repository's instructions and scripts. This license does not grant rights to third-party reference designs, fonts, images, icons, logos, or other assets.
