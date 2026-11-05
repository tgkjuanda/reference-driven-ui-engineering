# UI Reference Replication Engine

[![Validate Agent Skill](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/ui-reference-replication/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Rebuild or redesign interfaces from visual references—faithfully or with an original creative direction, using task-routed context and evidence-led QA.**

UI Reference Replication is a vendor-neutral Agent Skill for vision-capable coding agents. It helps agents inspect Figma designs, live websites, and screenshots; understand the visual system; implement the interface in an existing codebase; and verify the rendered result.

It supports both **new UI builds** and **redesigns of existing applications**. Creative work includes a required anti-AI-slop review so the result is specific to the product rather than an interchangeable collection of trendy effects.

> **Visual perception is a hard requirement.** The agent must be able to inspect both the source reference and its own rendered screenshots. If it cannot see and assess both, it must reject the task before changing the project. Text-only analysis, DOM/CSS inspection, Figma metadata, OCR, or pixel-diff numbers are not substitutes for visual review.

## Capabilities

- **Reference analysis:** inspect visual hierarchy, layout, typography, color, spacing, components, assets, responsive behavior, interactions, and observable motion.
- **New UI implementation:** build reference-led interfaces using the target project's existing framework and conventions.
- **Existing UI redesign:** restyle an application while preserving its routes, features, data, permissions, APIs, validation, and workflows by default.
- **Creative interpretation:** retain selected design anchors while creating an original and coherent visual direction.
- **Anti-AI-slop review:** reject generic templates, unjustified trend stacking, filler assets/content, and decorative treatments without a product-specific reason.
- **Design systems:** establish reusable design tokens, semantic roles, component variants, and consistent patterns.
- **Motion and effects:** analyze and implement purposeful transitions, micro-interactions, scroll-linked motion, reduced-motion alternatives, and visual effects.
- **Quality assurance:** inspect screenshots, compare visual states, audit accessibility, test responsive behavior, and run functional/regression checks where the project environment supports them.
- **Functional regression:** execute declared Playwright route/interaction checks before and after redesign, then compare reports to identify regressions and pre-existing failures.
- **Responsive audit:** test declared routes across mobile, tablet, and desktop viewports for document overflow, viewport metadata, navigation failures, and page errors.
- **Performance budget:** record browser lab TTFB, FCP, LCP, CLS, observed long-task blocking, and resource transfer metrics against project budgets.
- **Dependency security:** summarize npm dependency advisories from a committed lockfile without modifying dependencies.
- **Unified quality report:** require evidence-backed status for task-specific visual, functional, responsive, accessibility, performance, security, and design-system gates.
- **Perceptual visual QA:** record dimension-level findings for layout, hierarchy, typography, color, components, responsive behavior, and product-specific design quality.

## Choose two modes

Work mode and fidelity mode are independent. Select one from each group before implementation.

### Work mode

| Mode | Use it for |
|---|---|
| **New Build** | Create a new interface from a visual reference. |
| **Existing UI Redesign** | Transform the visual design of an application that already exists. |
| **Hybrid** | Redesign selected screens and create new screens in the same project. |

### Fidelity mode

| Mode | Design behavior |
|---|---|
| **Reference-Faithful** | Stay close to the reference's composition, hierarchy, visual language, and observable interaction patterns. |
| **Reference-Inspired Creative** | Preserve selected design qualities, but reinterpret layout, component composition, palette, typography, imagery, effects, and motion to create an original design. |

Examples:
- `New Build + Reference-Faithful`: reproduce a supplied product page as closely as the evidence allows.
- `Existing UI Redesign + Reference-Inspired Creative`: give an existing dashboard a new visual identity inspired by a reference, without changing its business logic.
- `Hybrid + Reference-Inspired Creative`: redesign the current application shell and create new screens in the same design language.

## Creative design without AI slop

Creative freedom does not mean adding every fashionable effect. In Reference-Inspired Creative mode, the agent must:

1. Understand the actual product, users, tasks, content, and brand constraints.
2. Write a product-specific design thesis and choose one or two distinctive visual devices.
3. Define what to **Preserve**, **Reinterpret**, **Protect**, and **Avoid**.
4. Build a consistent system for composition, typography, color, surfaces, assets, components, and motion.
5. Complete the de-slop review before delivery.

The anti-slop guide treats gradients, glassmorphism, neon, blur, 3D, rounded cards, pill controls, and parallax as optional techniques—not defaults. They are allowed when the reference, product, identity, or interaction justifies them.

The review also rejects interchangeable hero/card-grid templates, repetitive card layouts, decorative badges, generic filler imagery, fabricated metrics/testimonials/logos, and inconsistent mixes of visual styles.

Read [Anti-AI-Slop and Design Originality](skills/ui-reference-replication/references/anti-ai-slop.md) and [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md).

## Token-efficient task planning

The bundled planner selects the minimum task-relevant references and suggested checks. It is dependency-free:

```bash
node skills/ui-reference-replication/scripts/plan-task.mjs \\
  --work-mode existing-redesign \\
  --fidelity reference-inspired-creative \\
  --motion --accessibility --responsive
```

Read only the required references first; load conditional material when its topic is in scope. This reduces unnecessary context loading but does not meter provider tokens or guarantee a fixed percentage of cost savings.

## Installation

Install from the repository with the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add tgkjuanda/ui-reference-replication
```

To target selected agents explicitly:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

Use the CLI's interactive agent selector for other supported destinations. Check the CLI's current documentation for supported agent identifiers and runtime requirements.

**Important:** an agent platform being installable does not guarantee that the selected model/runtime has visual perception. Confirm that the actual session can inspect the reference image and the screenshots it produces. Installing this Skill does not grant Figma access, browser control, terminal permissions, or image/video perception.

## Quick start

In a vision-capable coding agent, invoke the Skill and provide a reference URL or attach the reference images.

### Example: creative redesign of an existing application

```text
@ui-reference-replication

WORK MODE: EXISTING UI REDESIGN
FIDELITY MODE: REFERENCE-INSPIRED CREATIVE

Redesign the current application using this reference as visual
inspiration:
https://example.com/reference

Preserve the reference's editorial mood, warm color character,
expressive typography, and layered visual treatment. Create an
original composition and component system; do not copy it exactly.

Preserve all existing routes, features, data, permissions, APIs,
validation, and business workflows. Change functionality only
when I explicitly approve it.

First confirm that you can visually inspect both the reference
and screenshots of the current application. Capture baseline
screenshots and run existing tests. Create a creative direction
brief, implement the redesign, inspect the rendered result, run
the anti-AI-slop review, and repeat regression tests.

Report visual evidence, test results, preserved behavior, and
remaining deviations. Do not claim completion when a required
check was not performed.
```

### Example: faithful new build

```text
@ui-reference-replication

WORK MODE: NEW BUILD
FIDELITY MODE: REFERENCE-FAITHFUL

Build the requested interface from the supplied reference.
Inspect the reference visually before coding. Preserve its
visual hierarchy, composition, typography, color language,
components, and observable interactions as closely as possible.

Use the current project's framework and conventions. Capture
the implementation at matching viewports and states, inspect
both images visually, correct verified differences, and report
all tests and unresolved gaps.
```

## How the workflow works

1. **Visual preflight:** confirm the agent can perceive the source reference and its own rendered output. Reject the task if it cannot.
2. **Reference and project inspection:** analyze the reference, current codebase, design system, routes, states, and available tests.
3. **Direction and mapping:** select work/fidelity modes, extract design anchors, and map reference patterns to existing components. Creative mode adds a design thesis and anti-slop brief.
4. **Implementation:** build or migrate tokens, layouts, components, responsive behavior, interactions, motion, and effects.
5. **Visual correction:** capture matching states, inspect screenshots perceptually, use diff/heatmap as supporting diagnostics, and correct visible defects.
6. **Functional and regression QA:** verify primary workflows, accessibility, responsive behavior, reduced motion, and existing product contracts in redesign mode.
7. **Delivery report:** list evidence, changed files, tests actually run, deviations, and anything not tested.

## Documentation

| Document | Purpose |
|---|---|
| [Quality Gates](docs/QUALITY-GATES.md) | Acceptance criteria and delivery scorecard. |
| [Complete Quality Assurance](skills/ui-reference-replication/references/complete-quality-assurance.md) | Responsive, performance, dependency-security, and unified evidence-report checks. |
| [Performance Budget Template](skills/ui-reference-replication/templates/performance-budget.example.json) | Explicit browser lab thresholds for a target application. |
| [Quality Report Template](skills/ui-reference-replication/templates/quality-report.example.json) | Evidence-backed gate status for task delivery. |
| [Token-Efficient Execution](skills/ui-reference-replication/references/token-efficient-execution.md) | Context routing, reuse, automation, and bounded iteration. |
| [Visual Evidence Validation](skills/ui-reference-replication/references/evidence-and-visual-qa.md) | Pairing, validating, and auditing screenshot evidence. |
| [Perceptual Visual Review Template](skills/ui-reference-replication/templates/perceptual-visual-review.example.json) | Structured visual assessment by fidelity mode. |
| [Functional Regression Example](skills/ui-reference-replication/templates/functional-regression.example.json) | Explicit browser test scenario format for project workflows. |
| [Automated Workflow](docs/AUTOMATED-WORKFLOW.md) | Repository CI and consumer-project QA process. |
| [Agent Compatibility](docs/AGENT-COMPATIBILITY.md) | Agent installation paths and compatibility notes. |
| [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md) | Mandatory visual-perception prerequisite and rejection behavior. |
| [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md) | Baseline, controlled migration, and behavior preservation. |
| [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md) | Preserve, reinterpret, protect, and avoid design decisions. |
| [Anti-AI-Slop](skills/ui-reference-replication/references/anti-ai-slop.md) | Product-specific design originality and de-slop checklist. |
| [Motion Design](skills/ui-reference-replication/references/motion-design.md) | Animation, visual effects, reduced motion, and motion QA. |
| [Figma Analysis](skills/ui-reference-replication/references/figma-analysis.md) | Figma inspection, MCP context, and design-to-code mapping. |
| [Accessibility](skills/ui-reference-replication/references/accessibility.md) | Accessibility implementation and review. |
| [Design System Engineering](skills/ui-reference-replication/references/design-system-engineering.md) | Tokens, components, and visual consistency. |

## QA toolkit

Run repository validation from the repository root:

```bash
npm test
npm run check
npm run validate:tokens
npm run validate:visual-evidence -- --file artifacts/ui-reference/visual-evidence.json --root .
npm run regression -- --config tests/ui-regression.json --label baseline --out artifacts/ui-reference/baseline.json
npm run regression -- --config tests/ui-regression.json --label post-redesign --out artifacts/ui-reference/post-redesign.json
npm run compare:regression -- --baseline artifacts/ui-reference/baseline.json --actual artifacts/ui-reference/post-redesign.json
npm run validate:visual-review -- --file artifacts/ui-reference/visual-review.json --evidence artifacts/ui-reference/visual-evidence.json --root .
npm run responsive:audit -- --url http://localhost:3000 --routes /,/dashboard --out artifacts/ui-reference/responsive.json
npm run performance:audit -- --url http://localhost:3000 --budget artifacts/ui-reference/performance-budget.json --out artifacts/ui-reference/performance.json
npm run security:audit -- --root . --fail-on high --out artifacts/ui-reference/dependency-audit.json
npm run validate:quality-report -- --file artifacts/ui-reference/quality-report.json --root .
```

Inspect a target project:

```bash
node skills/ui-reference-replication/scripts/inspect-project.mjs --root .
```

Capture local implementation screenshots:

```bash
node skills/ui-reference-replication/scripts/capture-screenshots.mjs \
  --url http://localhost:3000 \
  --routes /,/dashboard \
  --out artifacts/ui-reference
```

Validate the screenshot evidence manifest after completing the required direct visual review:

```bash
node skills/ui-reference-replication/scripts/validate-visual-evidence.mjs --file artifacts/ui-reference/visual-evidence.json --root .
```

The manifest validator checks integrity and review declarations; it does not prove perceptual understanding.

Compare an authorized reference screenshot with the implementation:

```bash
python skills/ui-reference-replication/scripts/compare-screenshots.py \
  reference.png actual.png \
  --diff artifacts/ui-reference/diff.png
```

Run an automated accessibility scan:

```bash
node skills/ui-reference-replication/scripts/accessibility-audit.mjs \
  --url http://localhost:3000
```

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md) for requirements and options.

## Complete quality assurance

The unified quality report combines required gates into one Pass / Partial / Fail / Not Tested summary. Start from the quality-report template, attach actual evidence, and validate with npm run validate:quality-report. See [Complete Quality Assurance](skills/ui-reference-replication/references/complete-quality-assurance.md).

## Runtime requirements and honest limitations

This repository provides instructions and helper scripts; it does not provide the runtime capabilities itself.

- **Visual inspection:** the model/session must directly perceive reference and implementation images.
- **Browser screenshots:** Playwright and a configured browser (the bundled capture script uses Chromium).
- **Motion verification:** browser interaction/recording or sampled animation frames that the agent can actually inspect.
- **Accessibility scan:** Playwright and axe-core; automated findings do not replace manual review.
- **Pixel comparison:** Python and Pillow; pixel metrics are diagnostics, not a perceptual quality score.
- **Figma inspection:** an authorized Figma MCP/API connection when structured design data is needed.
- **Project execution:** appropriate local project permissions, dependencies, credentials, and services.

The bundled token validator supports a subset of DTCG token structures; it is not a complete conformance validator. A repository CI pass validates the Skill and helper scripts, not the visual quality of every application built with it. The Skill must report blocked or untested checks rather than imply that they passed.

For existing UI redesign, a visually successful result is still incomplete if it breaks the product's existing features or workflows. For creative mode, a large pixel difference from the reference is not automatically a defect; the result is evaluated against the creative direction brief, product fit, and design quality.

## Versioning and changelog

Current Skill version: **3.0.0**

See [CHANGELOG.md](CHANGELOG.md) for release history and notable changes.

## Contributing

Issues and pull requests are welcome. Useful contributions include:
- Reproducible visual before/after evidence.
- Agent/runtime compatibility results.
- Motion recordings and reduced-motion test cases.
- Regression reports from real redesign projects.
- Improvements to QA scripts and documentation.

Open an issue: [github.com/tgkjuanda/ui-reference-replication/issues](https://github.com/tgkjuanda/ui-reference-replication/issues)

## License

This repository's instructions and scripts are licensed under [MIT](LICENSE). The license does not grant rights to third-party designs, fonts, images, icons, logos, or other assets referenced during implementation.
