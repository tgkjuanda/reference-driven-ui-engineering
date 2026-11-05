# UI Reference Replication Engine

A cross-agent Agent Skill for turning Figma files, live websites, screenshots, and image references into responsive, accessible, maintainable frontend implementations — then verifying and improving the result with automated QA.

## Install

Requires Node.js 22.20+ for the current Vercel Skills CLI.

```bash
npx skills add tgkjuanda/ui-reference-replication
```

Install to Antigravity, Claude Code, and OpenCode:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

Use the CLI's interactive picker for other supported agents. Project scope is recommended for team repositories. Add `--global` when you want user-level installation and the selected agent supports that destination.

## Use

In a coding agent, invoke the skill and provide a reference:

```text
@ui-reference-replication

Rebuild this reference in the current project:
https://www.figma.com/design/...

Inspect the Figma frame and project before coding. Preserve the existing stack.
Extract tokens and components, implement responsive states, run visual and
accessibility checks, fix verified defects, and report all remaining gaps.
```

Screenshots/images can be attached instead of a URL.

## Engine capabilities

- Figma/website/screenshot evidence inspection.
- Design hierarchy, layout, typography, asset, and token extraction.
- Component-driven implementation in the existing project stack.
- Interaction feedback and error-state modeling.
- Responsive implementation and viewport testing.
- Playwright screenshot capture.
- Pixel-difference diagnostic and heatmap image.
- axe-core automated accessibility scanning.
- DTCG-oriented design token structural validation.
- GitHub Actions checks for the Skill repository.

## QA toolkit

Run dependency-free repository checks:

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md) for screenshot and accessibility commands, and [Figma MCP Integration](skills/ui-reference-replication/references/figma-analysis.md) for structured design extraction.

## Runtime dependencies

The Skill does not provide browser/Figma access by itself.

- Screenshot capture: Playwright in the target project/runtime.
- Accessibility scan: Playwright and axe-core.
- Pixel diff: Python and Pillow.
- Figma structured analysis: an authorized Figma MCP/API connection.
- Code Connect: configured Figma-to-code mappings in the relevant repository.

Use only available, authorized tools. If a capability is missing, the Agent must disclose it and continue with the strongest available evidence rather than claim the check passed.

## Quality standards

- Reference-centered and consistency-driven UI implementation.
- WCAG 2.2 AA as a target for applicable criteria; not a certification claim.
- DTCG Format Module 2025.10 as a portable token exchange target; not a W3C Recommendation.
- Per-gate statuses: Pass, Partial, Fail, Not tested.

Read:
- [Quality Gates](docs/QUALITY-GATES.md)
- [Agent Compatibility](docs/AGENT-COMPATIBILITY.md)
- [Automated Workflow](docs/AUTOMATED-WORKFLOW.md)
- [Reference Analysis](skills/ui-reference-replication/references/figma-analysis.md)

## License

MIT for this repository's instructions and scripts. This license does not grant rights to third-party reference designs, fonts, images, icons, logos, or other assets.
