# UI Reference Replication Engine

[![Validate Agent Skill](https://github.com/tgkjuanda/reference-driven-ui-engineering/actions/workflows/validate-skill.yml/badge.svg)](https://github.com/tgkjuanda/reference-driven-ui-engineering/actions/workflows/validate-skill.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**From visual reference to working interface—with evidence at every step.**

A screenshot shows a moment in a product. It does not explain how the interface behaves, what should happen on a smaller screen, or which parts of an existing application must remain untouched.

UI Reference Replication gives vision-capable coding agents a repeatable way to work through those gaps. It turns screenshots, Figma frames, mockups, and live websites into a practical build or redesign workflow—and asks the agent to inspect the result before calling the work complete.

Use it for a new interface, a visual redesign of an existing application, or a project that needs both. The guiding idea is simple: **make the interface intentional, keep the product working, and show the evidence behind the result.**

## What the Skill does

- **Reads references:** studies hierarchy, layout, typography, color, spacing, components, assets, responsive behavior, interaction states, and observable motion.
- **Builds new UI:** works with the target project's framework, dependencies, and established conventions.
- **Redesigns existing UI:** changes the visual layer while protecting routes, features, data, permissions, APIs, validation, and workflows by default.
- **Supports creative interpretation:** keeps selected reference qualities while developing a visual direction that belongs to the target product.
- **Establishes design systems:** organizes tokens, semantic roles, component variants, and repeatable patterns.
- **Handles motion:** accounts for transitions, micro-interactions, scroll-linked behavior, visual effects, and reduced-motion alternatives.
- **Checks the result:** supports screenshot review, functional regression, responsive and accessibility audits, performance budgets, dependency checks, and Figma-to-code mapping.
- **Documents the outcome:** distinguishes verified findings from estimates, missing access, skipped checks, and unresolved differences.

The repository also includes helper scripts and templates for evidence manifests, perceptual visual reviews, Playwright regression runs, benchmark comparisons, agent compatibility records, and unified quality reports.

## Pick the work mode and fidelity mode

These are two separate decisions. The work mode describes what is changing; the fidelity mode describes the design relationship to the reference.

### Work mode

| Mode | Use it when |
|---|---|
| **New Build** | The interface needs to be created in the target project. |
| **Existing UI Redesign** | An application already exists and its visual design needs to change. |
| **Hybrid** | Existing screens need a redesign and new screens are also part of the scope. |

### Fidelity mode

| Mode | Design intent |
|---|---|
| **Reference-Faithful** | Follow the reference's composition, hierarchy, visual language, components, and observable interactions as closely as the evidence allows. |
| **Reference-Inspired Creative** | Keep selected design anchors, but develop an original composition, component language, palette, typography, imagery, effects, or motion. |

A redesign can be faithful. A new build can be creative. The two choices are independent.

Examples:

- **New Build + Reference-Faithful:** recreate a supplied product page within the target project's stack.
- **Existing UI Redesign + Reference-Inspired Creative:** give a dashboard a distinct visual identity without changing its business rules.
- **Hybrid + Reference-Inspired Creative:** refresh the application shell and introduce new screens in the same design language.

When the distinction would materially affect the result and the user's intent is unclear, the agent should ask one focused question before implementation.

## Visual inspection is a prerequisite

This workflow depends on the agent being able to inspect two things directly:

1. The source reference: a screenshot, image, rendered website, or selected Figma frame.
2. The implementation: screenshots captured at relevant routes, viewports, and interface states.

Text descriptions, DOM/CSS inspection, Figma metadata, OCR, and pixel-difference numbers can support the investigation. They cannot replace visual review.

**If the active model or runtime cannot inspect both the reference and its rendered output, the agent must stop before modifying the project.** It should explain which capability is missing and request a suitable environment. It must not pass off a text-only reconstruction as visually verified work.

When motion is in scope, the agent also needs to inspect a recording or captured animation frames. A static image cannot establish timing, easing, or sequence.

See [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md).

## How the work moves forward

The workflow makes the important decisions visible and keeps verification connected to the implementation.

1. **Check visual access.** Confirm that the current session can inspect the reference and its own rendered output. Stop if it cannot.
2. **Inspect the project.** Identify the framework, routes, components, design tokens, application states, and available tests.
3. **Set the modes.** Record work mode, fidelity mode, target screens, viewports, interactions, and constraints.
4. **Read the reference.** Map layout, hierarchy, type, color, spacing, assets, responsive behavior, components, and motion. Record uncertainty instead of guessing.
5. **Implement in context.** Follow the project's conventions, reuse what makes sense, and protect existing product contracts.
6. **Review and correct.** Capture comparable states, inspect the screenshots, fix visible defects, and rerun relevant checks.
7. **Report honestly.** List changed files, checks actually performed, preserved behavior, intentional deviations, limitations, and anything left untested.

A result is not complete simply because it compiles or looks plausible in one screenshot. It must be reviewed against the selected fidelity mode, the product's needs, and the evidence collected during the task.

## Creative work needs a reason

Creative mode is not a license to decorate without direction. Before implementation, the agent writes a product-specific design thesis and a short brief covering four decisions:

- **Preserve:** the qualities from the reference that give it character.
- **Reinterpret:** the parts that should change to suit the target product.
- **Protect:** product constraints, user needs, and existing behavior that must remain intact.
- **Avoid:** choices that would make the result generic, inconsistent, or misleading.

The brief identifies one or two signature visual choices. The anti-slop review then asks whether those choices genuinely serve the product.

Gradients, glass effects, neon, blur, 3D, pill controls, parallax, and rounded cards are techniques—not defaults. Use them when the reference, product, brand, or interaction gives them a reason to exist.

The review also looks for interchangeable hero sections, repetitive card grids, decorative badges, filler imagery, fabricated metrics or testimonials, and unrelated visual styles competing on one screen.

Read [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md) and [Anti-AI-Slop and Design Originality](skills/ui-reference-replication/references/anti-ai-slop.md).

## Redesign without breaking the product

A visual reference rarely describes every behavior of the application being redesigned. Existing behavior is therefore a constraint, not disposable implementation detail.

Before changing an existing application, the agent records routes, features, data, permissions, APIs, forms, validation, and important workflows. It captures available baseline screenshots and runs the declared tests. After the redesign, it repeats the same checks and compares the results.

An element missing from the reference is not a reason to remove a working feature. Functional changes must be identified separately and approved by the user.

See [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md).

## Automatic routing in Antigravity

The repository includes an Antigravity workspace rule at **.agents/rules/ui-reference-replication.md**. Its **always_on** trigger routes reference-led web/app implementation, redesign, and visual-QA requests to this Skill by default. The user does not need to name the Skill.

The rule and the Skill are installed separately:

- **Skill:** install in the workspace at **.agents/skills/ui-reference-replication/** or globally at **~/.gemini/config/skills/ui-reference-replication/**.
- **Workspace rule:** copy the rule into the target workspace's **.agents/rules/** directory.
- **Global rule:** copy it to **~/.gemini/config/rules/ui-reference-replication.md** to route matching work across Antigravity workspaces on that machine.

From this repository, install the workspace rule:

~~~bash
mkdir -p /path/to/your-app/.agents/rules
cp .agents/rules/ui-reference-replication.md /path/to/your-app/.agents/rules/
~~~

Or install the global rule:

~~~bash
mkdir -p ~/.gemini/config/rules
cp .agents/rules/ui-reference-replication.md ~/.gemini/config/rules/
~~~

Installing a Skill through an installer does not necessarily install this separate rule. Other Agent Skills-compatible agents may discover the Skill through its description, but automatic selection depends on each agent's own routing mechanism.

No routing rule can compensate for a missing Skill installation or unavailable visual, browser, or terminal capabilities. The active session still needs to pass the visual prerequisite.

## Installation

Install from this repository with the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

~~~bash
npx skills add tgkjuanda/reference-driven-ui-engineering
~~~

To target selected agents explicitly:

~~~bash
npx skills add tgkjuanda/reference-driven-ui-engineering \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
~~~

Use the installer's interactive selector for other supported destinations. Check its current documentation for supported agent identifiers and runtime requirements.

Installation does not prove that the selected model/runtime can see images or operate the tools needed for a task. This repository does not grant Figma access, browser control, terminal permissions, file-write access, credentials, or image/video perception.

## Quick start

In a vision-capable coding agent, invoke the Skill and provide a reference URL or attach the reference images.

### Example: creative redesign

~~~text
@ui-reference-replication

WORK MODE: EXISTING UI REDESIGN
FIDELITY MODE: REFERENCE-INSPIRED CREATIVE

Use this reference as visual inspiration:
https://example.com/reference

Keep its editorial mood and expressive typography, but create
an original composition and component system. Do not copy it
screen for screen.

Preserve the application's routes, features, data, permissions,
APIs, validation, and business workflows. Do not change
functionality without my approval.

First confirm that you can inspect the reference and the
application screenshots. Capture baseline screenshots and run
the existing tests. Write the design brief, implement the
redesign, inspect the rendered result, complete the anti-slop
review, and repeat the relevant regression checks.

Report the evidence, test results, preserved behavior, and
remaining differences. Do not mark unchecked work as passed.
~~~

### Example: faithful new build

~~~text
@ui-reference-replication

WORK MODE: NEW BUILD
FIDELITY MODE: REFERENCE-FAITHFUL

Build the interface from the supplied reference.

Inspect the reference before writing code. Follow its visual
hierarchy, composition, typography, color language, components,
and observable interactions as closely as the evidence allows.

Use the target project's existing framework and conventions.
Capture the implementation at matching viewports and states,
inspect both sets of images, correct verified differences,
and report the checks performed and any unresolved gaps.
~~~

## Keep context focused

The bundled task planner selects the references and checks relevant to a job. It has no runtime dependencies:

~~~bash
node skills/ui-reference-replication/scripts/plan-task.mjs \
  --work-mode existing-redesign \
  --fidelity reference-inspired-creative \
  --motion --accessibility --responsive
~~~

Read the required references first. Load conditional material only when it is in scope. This keeps context focused without removing mandatory visual, functional, accessibility, or regression checks.

The planner selects context; it does not measure provider tokens or guarantee a percentage of cost savings.

## Quality assurance toolkit

Run repository validation from the repository root:

~~~bash
npm test
npm run check
npm run validate:tokens
~~~

For a specific implementation, run the checks relevant to its scope. The npm commands below are repository-level conveniences. When the Skill is installed in another project, use the helper scripts directly from the Skill directory; see the [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md).

| Check | What it covers |
|---|---|
| Visual evidence | Screenshot pairs, routes, states, viewports, hashes, and review declarations. |
| Perceptual visual review | Dimension-level findings for layout, hierarchy, typography, color, components, responsive behavior, and design quality. |
| Functional regression | Declared Playwright routes and interactions, compared before and after a redesign. |
| Responsive audit | Viewport overflow, viewport metadata, navigation failures, and page errors. |
| Performance audit | Browser-lab TTFB, FCP, LCP, CLS, observed long-task blocking, and resource transfer sizes. |
| Dependency audit | npm advisories from the committed lockfile, without automatically changing dependencies. |
| Quality report | Evidence-backed Pass, Partial, Fail, or Not Tested status for required gates. |
| Design intelligence | Scoped Figma variable/component mappings, implementation paths, and recorded drift. |
| Benchmark | Same-fixture comparisons with repeated runs and measured provider/host usage. |
| Agent compatibility | Installation separated from visual input, browser, terminal, file-write, Figma MCP, and motion capabilities. |

A valid manifest or report confirms that its structure and referenced files passed validation. It does not independently prove that an agent understood an image, that an application is accessible, or that a design is good. Those judgments must remain tied to actual inspection and evidence.

See [QA Toolkit Guide](skills/ui-reference-replication/scripts/README.md) for commands and options, and [Quality Gates](docs/QUALITY-GATES.md) for acceptance criteria.

## Documentation

| Document | Purpose |
|---|---|
| [Quality Gates](docs/QUALITY-GATES.md) | Acceptance criteria and delivery scorecard. |
| [Automated Workflow](docs/AUTOMATED-WORKFLOW.md) | Repository CI and consumer-project QA process. |
| [Agent Compatibility](docs/AGENT-COMPATIBILITY.md) | Installation paths and compatibility notes. |
| [Visual Capability Gate](skills/ui-reference-replication/references/visual-capability-gate.md) | Visual prerequisites and when the Skill must stop. |
| [Existing UI Redesign](skills/ui-reference-replication/references/existing-ui-redesign.md) | Baselines, controlled migration, and behavior preservation. |
| [Creative Reference Mode](skills/ui-reference-replication/references/creative-reference-mode.md) | Preserve, reinterpret, protect, and avoid decisions. |
| [Anti-AI-Slop](skills/ui-reference-replication/references/anti-ai-slop.md) | Originality, product fit, and the de-slop review. |
| [Figma Analysis](skills/ui-reference-replication/references/figma-analysis.md) | Figma inspection and design-to-code mapping. |
| [Design Intelligence](skills/ui-reference-replication/references/design-intelligence.md) | Scoped Figma-to-code mapping and drift interpretation. |
| [Design System Engineering](skills/ui-reference-replication/references/design-system-engineering.md) | Tokens, components, and visual consistency. |
| [Motion Design](skills/ui-reference-replication/references/motion-design.md) | Animation, effects, reduced motion, and motion QA. |
| [Accessibility](skills/ui-reference-replication/references/accessibility.md) | Accessibility implementation and review. |
| [Complete Quality Assurance](skills/ui-reference-replication/references/complete-quality-assurance.md) | Responsive, performance, dependency-security, and unified quality-report checks. |
| [Token-Efficient Execution](skills/ui-reference-replication/references/token-efficient-execution.md) | Context routing, reuse, automation, and bounded iteration. |
| [Visual Evidence Validation](skills/ui-reference-replication/references/evidence-and-visual-qa.md) | Screenshot evidence, review records, and QA checklists. |
| [Benchmark Protocol](skills/ui-reference-replication/references/benchmark-protocol.md) | Controlled token/cost comparisons and agent capability verification. |

Key templates:

- [Performance Budget](skills/ui-reference-replication/templates/performance-budget.example.json)
- [Quality Report](skills/ui-reference-replication/templates/quality-report.example.json)
- [Perceptual Visual Review](skills/ui-reference-replication/templates/perceptual-visual-review.example.json)
- [Functional Regression](skills/ui-reference-replication/templates/functional-regression.example.json)
- [Benchmark](skills/ui-reference-replication/templates/benchmark.example.json)
- [Agent Compatibility](skills/ui-reference-replication/templates/agent-compatibility.example.json)

## Runtime requirements and limitations

This repository provides instructions and helper scripts. It does not provide the runtime capabilities they depend on.

- **Visual inspection:** the active model/session must directly perceive the reference and implementation images.
- **Browser screenshots and regression:** Playwright and a configured browser; the bundled capture script uses Chromium.
- **Motion review:** browser interaction, a recording, or sampled animation frames the agent can actually inspect.
- **Accessibility scan:** Playwright and axe-core. Automated findings do not replace manual review.
- **Pixel comparison:** Python and Pillow. Pixel metrics are diagnostic signals, not perceptual quality scores.
- **Figma inspection:** an authorized Figma MCP/API connection when structured design data is needed.
- **Project execution:** appropriate local permissions, dependencies, credentials, and running services.

The bundled token validator supports a subset of DTCG token structures, not the entire standard. A passing repository CI run validates the Skill and helper scripts; it does not validate the visual quality of applications built with them. The Skill must report blocked or untested checks instead of implying they passed.

For a redesign, a convincing screenshot is not enough if an existing workflow no longer works. For creative work, a large pixel difference from the reference is not automatically a defect; the result is assessed against the design brief, product fit, and visual coherence.

## Benchmarks and compatibility claims

Benchmark only when there is a meaningful comparison to make. Use the same scenario, fixture, agent, model, and runtime for at least three runs.

Only provider- or host-reported token and cost usage supports savings claims. Lower usage is not an improvement when visual or functional quality regresses. The protocol also records installation separately from the runtime capabilities an agent actually has.

See [Benchmark Protocol](skills/ui-reference-replication/references/benchmark-protocol.md).

## Version

Current Skill version: **3.2.1**

Repository changes are recorded in [CHANGELOG.md](CHANGELOG.md). A repository version does not imply that every external agent, runtime, or consumer application has been independently tested.

## Contributing

Useful contributions make the workflow easier to verify in real projects:

- Reproducible before/after visual evidence.
- Results from agent and runtime compatibility tests.
- Motion recordings and reduced-motion test cases.
- Regression reports from actual redesigns.
- Improvements to QA scripts, examples, and documentation.

Issues and pull requests are welcome: [open an issue](https://github.com/tgkjuanda/reference-driven-ui-engineering/issues).

## License

The instructions and scripts in this repository are licensed under [MIT](LICENSE). That license does not grant rights to third-party designs, fonts, images, icons, logos, or other assets used as implementation references.
