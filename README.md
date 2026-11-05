# UI Reference Replication Engine

[![skills.sh](https://skills.sh/b/tgkjuanda/ui-reference-replication)](https://skills.sh/tgkjuanda/ui-reference-replication)
[![Validate Agent Skill](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Rebuild or redesign existing UI from references, then visually verify the result.**

A cross-agent Agent Skill for vision-capable coding agents. It supports new UI builds and controlled redesigns of existing applications using Figma, live websites, and screenshots. It reverse-engineers design systems, interactions, animation, and visual effects, then compares the rendered implementation against the actual visual reference.

**Visual perception is mandatory.** The agent must inspect both the source reference and its own rendered screenshots/recordings. Agents that cannot perceive those visuals must reject the task; text-only analysis, DOM/CSS inspection, Figma metadata, OCR, and pixel-diff numbers are not substitutes for visual review.

## Work modes

- **New build:** implement a new interface from the supplied visual reference.
- **Existing UI redesign:** transform the visual style/theme of an existing app to match a reference while preserving existing routes, features, data, permissions, APIs, validation, and workflows by default.
- **Hybrid:** redesign selected existing screens and add new screens only where requested.

Existing UI redesign is a controlled migration, not a greenfield rebuild. It requires a baseline inventory, a reference-to-component migration map, and post-change regression checks. Read [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md).

## Install

Requires Node.js 22.20+ for the current Vercel Skills CLI and a vision-capable agent/runtime.

```bash
npx skills add tgkjuanda/ui-reference-replication
```

Install explicitly to supported agent destinations:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

Agent platform support does not guarantee image perception. The model and current runtime must inspect both reference and generated output images. Installation copies the Skill; it does not grant Figma, browser, terminal, or image/video capabilities.

## Use it

In a vision-capable coding agent, invoke `@ui-reference-replication` and provide a reference:

```text
@ui-reference-replication

Redesign the existing application in this project to follow this UI reference:
https://example.com/reference

First confirm you can visually inspect both the reference and the
current/redesigned application screenshots. If you cannot, reject
the task and do not edit the project.

Preserve current routes, features, data, permissions, APIs, form
validation, and business workflows. Change visual design and
interaction presentation to match the reference. Only change
functionality when I explicitly approve it.

Capture baseline screenshots and run existing tests first.
Implement the design system and migrate shared components.
Compare screenshots, retest existing workflows, test responsive
and reduced-motion behavior, and report all regressions.
```

## What it does

- **Reference intelligence:** inspect Figma frames, website layouts, screenshots, typography, assets, and component structure.
- **Existing UI redesign:** migrate an existing product's visual theme and components while protecting its current behavior and data/API contracts.
- **Design system:** map semantic design tokens, visual hierarchy, reusable components, and variants.
- **Motion design:** inspect and reconstruct micro-interactions, transitions, scroll-linked motion, animation timing/easing, and reduced-motion alternatives.
- **Visual effects:** reproduce reference-backed gradients, blur, shadows, glow, masks, transparency, and advanced visual treatments with fallbacks.
- **Frontend implementation:** work within the existing React, Next.js, Vue, or other project stack.
- **Interaction quality:** define loading, empty, success, disabled, validation, and error-recovery states.
- **Responsive QA:** capture representative or source-supplied viewport sizes and review motion on touch/narrow layouts.
- **Visual QA:** inspect screenshots and recordings perceptually, supported by overlays, heatmaps, and pixel-diff diagnostics.
- **Regression QA:** compare pre-redesign and post-redesign routes, forms, tables, permissions, and critical workflows.

## QA toolkit

Repository checks:

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md), [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md), [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md), [Motion Design](skills/ui-reference-replication/references/motion-design.md), and [Figma MCP Integration](skills/ui-reference-replication/references/figma-analysis.md).

## Runtime requirements and limitations

The Skill does not provide browser/Figma/image perception by itself.

- Screenshot capture: Playwright and Chromium in the target project/runtime.
- Visual inspection: a model/runtime that can directly perceive both reference and implementation images.
- Motion verification: ability to inspect relevant animation recordings or captured frames, plus browser interaction/performance tools.
- Accessibility scan: Playwright and axe-core.
- Pixel diff: Python and Pillow.
- Structured Figma analysis: an authorized Figma MCP/API connection.
- Code Connect: configured Figma-to-code mappings in the relevant project.

Screenshot capture and pixel metrics are supporting evidence, not perceptual judgment. If the agent cannot visually inspect the reference and the rendered implementation, the Skill must reject the task. In redesign mode, the Skill also requires existing-product baseline and post-redesign regression evidence. Do not downgrade to a text-only approximation or report visual fidelity as passed.

## Quality standards

- Reference-centered, component-driven, token-based implementation.
- Existing UI redesign preserves product behavior by default; functional changes require explicit approval.
- Direct perceptual inspection of source and implementation is a hard prerequisite.
- WCAG 2.2 AA as a target for applicable criteria — not a certification claim.
- Reduced-motion support for non-essential interactions as an additional project quality policy; WCAG 2.2 SC 2.3.3 itself is Level AAA.
- DTCG Format Module 2025.10 as a portable token interchange target — the validator is partial.
- Per-gate status: Pass, Partial, Fail, or Not tested.

## Documentation

- [Quality Gates](docs/QUALITY-GATES.md)
- [Agent Compatibility](docs/AGENT-COMPATIBILITY.md)
- [Automated Workflow](docs/AUTOMATED-WORKFLOW.md)
- [Launch Kit and Promotion Plan](docs/LAUNCH-KIT.md)
- [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md)
- [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md)
- [Motion Design](skills/ui-reference-replication/references/motion-design.md)
- [Reference Analysis](skills/ui-reference-replication/references/figma-analysis.md)

## Contributing

Bug reports, agent compatibility results, reproducible before/after screenshots, regression reports, motion recordings, and improvements to the QA scripts are welcome. See [Issues](https://github.com/tgkjuanda/ui-reference-replication/issues).

## License

MIT for this repository's instructions and scripts. This license does not grant rights to third-party reference designs, fonts, images, icons, logos, or other assets.
