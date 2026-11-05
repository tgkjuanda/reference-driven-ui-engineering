# UI Reference Replication Engine

[![skills.sh](https://skills.sh/b/tgkjuanda/ui-reference-replication)](https://skills.sh/tgkjuanda/ui-reference-replication)
[![Validate Agent Skill](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Build or redesign UI from references — faithfully or with original creative interpretation.**

A cross-agent Agent Skill for vision-capable coding agents. It supports new UI builds and redesigns of existing applications using Figma, live websites, and screenshots. Choose between close reference replication and an original design inspired by the reference; then verify visual, functional, responsive, accessibility, motion, and regression quality.

**Visual perception is mandatory.** The agent must inspect both the source reference and its own rendered screenshots/recordings. Agents that cannot perceive those visuals must reject the task; text-only analysis, DOM/CSS inspection, Figma metadata, OCR, and pixel-diff numbers are not substitutes for visual review.

## Work modes

- **New build:** implement a new interface from the supplied visual reference.
- **Existing UI redesign:** transform the visual style/theme of an existing app while preserving existing routes, features, data, permissions, APIs, validation, and workflows by default.
- **Hybrid:** redesign selected existing screens and add new screens only where requested.

## Fidelity modes

- **Reference-Faithful:** stay close to the reference composition, hierarchy, visual language, components, and interactions.
- **Reference-Inspired Creative:** preserve selected design anchors but create an original interpretation. Layout, component composition, exact colors, typography pairing, imagery, effects, and animation may be reinterpreted.

Work mode and fidelity mode are independent. For example, an existing dashboard can be redesigned in Reference-Inspired Creative mode without changing its business logic.

Read [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md) and [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md).

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

In a vision-capable coding agent:

```text
@ui-reference-replication

MODE: EXISTING UI REDESIGN
FIDELITY: REFERENCE-INSPIRED CREATIVE

Redesign the current application inspired by this visual reference:
https://example.com/reference

Preserve the reference's bold editorial mood, warm color character,
expressive typography, and layered visual treatment.
Create an original layout and component system; do not copy it
pixel-for-pixel.

Preserve current routes, features, data, permissions, APIs,
validation, and business workflows. Only change functionality
when I explicitly approve it.

First inspect the reference and current app visually. Capture
baseline screenshots and run existing tests. Build a creative
direction brief, implement the redesign, visually review the
result, rerun regression tests, and report remaining gaps.
```

## What it does

- **Reference intelligence:** inspect Figma frames, website layouts, screenshots, typography, assets, and component structure.
- **Existing UI redesign:** migrate an existing product's visual theme and components while protecting its current behavior and data/API contracts.
- **Creative design:** retain selected visual DNA while producing an original and coherent interpretation.
- **Design system:** map semantic design tokens, visual hierarchy, reusable components, and variants.
- **Motion design:** inspect and reconstruct or reinterpret micro-interactions, transitions, scroll-linked motion, animation timing/easing, and reduced-motion alternatives.
- **Visual effects:** reproduce or creatively reinterpret gradients, blur, shadows, glow, masks, transparency, and advanced visual treatments with fallbacks.
- **Frontend implementation:** work within the existing React, Next.js, Vue, or other project stack.
- **Responsive and functional QA:** test interactions, responsive behavior, accessibility, reduced motion, and recovery states.
- **Visual QA:** inspect screenshots and recordings perceptually, supported by overlays, heatmaps, and pixel-diff diagnostics.
- **Regression QA:** compare pre-redesign and post-redesign routes, forms, tables, permissions, and critical workflows.

## QA toolkit

```bash
npm test
npm run check
npm run validate:tokens
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md), [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md), [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md), [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md), [Motion Design](skills/ui-reference-replication/references/motion-design.md), and [Figma MCP Integration](skills/ui-reference-replication/references/figma-analysis.md).

## Runtime requirements and limitations

The Skill does not provide browser/Figma/image perception by itself.

- Screenshot capture: Playwright and Chromium in the target project/runtime.
- Visual inspection: a model/runtime that can directly perceive both reference and implementation images.
- Motion verification: ability to inspect relevant animation recordings or captured frames, plus browser interaction/performance tools.
- Accessibility scan: Playwright and axe-core.
- Pixel diff: Python and Pillow.
- Structured Figma analysis: an authorized Figma MCP/API connection.
- Code Connect: configured Figma-to-code mappings in the relevant project.

Screenshot capture and pixel metrics are supporting evidence, not perceptual judgment. If the agent cannot visually inspect the reference and the rendered implementation, the Skill must reject the task. In creative mode, visual QA evaluates the selected design anchors, originality, coherence, and product fit rather than minimum pixel difference. In redesign mode, the Skill also requires existing-product baseline and post-redesign regression evidence.

## Quality standards

- Reference-centered, component-driven, token-based implementation.
- Explicit work mode (new build, redesign, hybrid) and fidelity mode (reference-faithful, reference-inspired creative).
- Existing UI redesign preserves product behavior by default; functional changes require explicit approval.
- Direct perceptual inspection of source and implementation is a hard prerequisite.
- WCAG 2.2 AA as a target for applicable criteria — not a certification claim.
- Reduced-motion support for non-essential interactions as an additional project quality policy.
- DTCG Format Module 2025.10 as a portable token interchange target — the validator is partial.
- Per-gate status: Pass, Partial, Fail, or Not tested.

## Documentation

- [Quality Gates](docs/QUALITY-GATES.md)
- [Agent Compatibility](docs/AGENT-COMPATIBILITY.md)
- [Automated Workflow](docs/AUTOMATED-WORKFLOW.md)
- [Launch Kit and Promotion Plan](docs/LAUNCH-KIT.md)
- [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md)
- [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md)
- [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md)
- [Motion Design](skills/ui-reference-replication/references/motion-design.md)
- [Reference Analysis](skills/ui-reference-replication/references/figma-analysis.md)

## Contributing

Bug reports, agent compatibility results, reproducible before/after screenshots, regression reports, creative direction briefs, motion recordings, and improvements to the QA scripts are welcome. See [Issues](https://github.com/tgkjuanda/ui-reference-replication/issues).

## License

MIT for this repository's instructions and scripts. This license does not grant rights to third-party reference designs, fonts, images, icons, logos, or other assets.
