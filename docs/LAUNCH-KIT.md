# Launch Kit — UI Reference Replication

## Product architecture

UI Reference Replication has two editions:

- **Community Edition (Free):** the open-source reference-faithful implementation workflow published in the public GitHub repository.
- **Premium Edition:** a separately maintained edition that adds creative interpretation, advanced Figma intelligence, motion engineering, expanded QA/reporting, task planning, and benchmark capabilities. Premium is intended to be distributed through Agensi.io; availability is announced through its marketplace listing when published.

The public Community Edition repository must not contain Premium source files or link to external checkouts.

## Community Edition positioning

**Product:** UI Reference Replication  
**Tagline:** Build the interface shown in the reference.  
**Value proposition:** An open Agent Skill that helps coding agents reproduce supplied UI references faithfully and inspect the rendered result before claiming completion.

**Primary audience:** Frontend developers, design engineers, indie makers, and teams using Agent Skills-compatible coding agents.

## What the Community Edition provides

- Reference-led new builds and existing UI redesigns.
- One visual target: Reference-Faithful.
- Layout, hierarchy, typography, color, spacing, and component analysis.
- Existing product behavior preservation during redesigns.
- Screenshot capture and visual-difference diagnostics.
- Basic responsive and accessibility guidance.

## Install

~~~bash
npx skills add tgkjuanda/reference-driven-ui-engineering
~~~

Repository: https://github.com/tgkjuanda/reference-driven-ui-engineering

## Product Hunt draft

**Name:** UI Reference Replication  
**Tagline:** Build the interface shown in the reference.

**Description:** An open Agent Skill for coding agents that need to build or redesign interfaces from screenshots, visual references, public websites, and mockups. It keeps the source reference as the visual specification, works within the target project's existing stack, and supports screenshot comparison before delivery.

**Topics:** Developer Tools, AI, Frontend, Design Engineering.

**Maker comment:** I built this to address a common problem in AI-generated interfaces: a page can look polished and still drift from the design it was meant to follow. This Skill makes the agent inspect the reference and project first, implement in the existing stack, compare rendered screenshots, and report what was actually verified. Feedback from real projects and different coding agents is welcome.

## Short social post

I built an open Agent Skill for coding agents that need to reproduce a UI from a real reference—not generate another generic page.

Give it screenshots, a visual reference, or a public page. It guides the agent through inspection, implementation, and screenshot comparison.

Install: `npx skills add tgkjuanda/reference-driven-ui-engineering`

## Agensi Free Edition

Use [Agensi Submission Sheet](AGENSI-SUBMISSION.md) for marketplace copy, runtime compatibility, permission disclosures, limitations, and pre-submission checks. The listing's live demonstration must come from a real project run with genuine screenshots; repository tests are not user-facing proof.

## Launch checklist

- Confirm the install command works with a clean environment.
- Run `npm test`, `npm run check`, and the GitHub Actions workflow.
- Record a short demo with the source reference and the rendered comparison visible.
- Label all untested capabilities accurately.
- Keep Premium availability and purchase information on its Agensi.io listing.
- Ask users for concrete examples and bug reports, not artificial engagement.
