# Launch Kit — UI Reference Replication Engine

## Positioning

**Product name:** UI Reference Replication Engine

**Tagline:** Rebuild UI from references, then verify the result.

**One-sentence value proposition:**
Turn Figma files, website URLs, and screenshots into responsive frontend implementations — then inspect visual differences, accessibility findings, and remaining gaps with your AI coding agent.

**Primary audience:**
- Frontend engineers and design engineers.
- Developers using Claude Code, OpenCode, Antigravity, Codex, Cursor, and other Agent Skills-compatible tools.
- Indie makers and product teams building from Figma or visual references.
- Teams that need to reduce drift between design files and frontend code.

**Problem statement:**
AI coding agents can produce attractive UI, but attractive is not the same as reference-faithful. Layout geometry, typography, tokens, component variants, responsive behavior, and interaction states can drift from the reference — and a confident completion message does not prove the result is correct.

**What this project provides:**
A reusable Agent Skill plus optional QA scripts for reference inspection, token validation, browser screenshots, pixel-difference diagnostics, and automated accessibility checks.

## Main call to action

```bash
npx skills add tgkjuanda/reference-driven-ui-engineering
```

Repository: https://github.com/tgkjuanda/reference-driven-ui-engineering

## Product Hunt listing draft

**Name:** UI Reference Replication Engine

**Tagline (under 60 characters):**
Rebuild UI from references, then verify the result.

**Description:**
An open Agent Skill for turning Figma files, live websites, and screenshots into responsive frontend implementations. It inspects your reference and existing codebase, maps design tokens and reusable components, then helps verify the result with Playwright screenshots, visual-diff diagnostics, and axe-core accessibility checks when configured. Works with Agent Skills-compatible coding agents.

**Suggested topics:** Developer Tools, Artificial Intelligence, Design Tools.

**First maker comment:**
I built this because generating a page that looks plausible is easy; keeping it faithful to a real design reference is harder. The Skill makes the agent inspect the source and project first, extract the design system, implement in the existing stack, and report what was actually verified. The optional QA scripts capture the app, produce visual-difference artifacts, validate a supported DTCG token subset, and run axe-core checks. I would value feedback on the reference-analysis workflow, the install experience across agents, and which visual checks would make this most useful in a real frontend project.

Product Hunt guidance: ask for visits and feedback, not direct upvotes. Launch only when the README/demo/install path works for someone outside the author’s machine.

## X / Threads short post

I built an open-source Agent Skill for a common AI UI problem: matching the reference, not just generating a nice-looking page.

Give it a Figma link, URL, or screenshot. It helps inspect, build, compare screenshots, and report gaps.

Install: `npx skills add tgkjuanda/reference-driven-ui-engineering`

Feedback welcome: https://github.com/tgkjuanda/reference-driven-ui-engineering

## LinkedIn post

I’ve been working on an open-source project called **UI Reference Replication Engine**.

The problem it targets is simple: AI coding agents can generate a polished interface, but that does not mean the result matches the Figma file, website, or screenshot we started from.

The Skill gives an agent a repeatable workflow:
- Inspect the reference and the existing frontend project before coding.
- Extract layout, typography, design tokens, assets, and component patterns.
- Build in the project’s current stack.
- Check responsive layouts and interaction states.
- Capture screenshots and inspect visual differences.
- Run automated accessibility checks when the required tools are available.
- Report verified results, assumptions, and remaining gaps instead of claiming “pixel-perfect” without evidence.

It is designed for Agent Skills-compatible coding tools, including Claude Code, OpenCode, and Antigravity through their supported skill directories.

Install:
`npx skills add tgkjuanda/reference-driven-ui-engineering`

Repository:
https://github.com/tgkjuanda/reference-driven-ui-engineering

I’m looking for practical feedback from frontend developers and design engineers: what is the biggest source of drift between your Figma designs and AI-generated UI?

## Reddit / community post draft

**Title:** I built an Agent Skill to recreate UI from Figma and screenshots, then run visual QA — looking for practical feedback

**Body:**

I’ve been experimenting with a workflow for a problem I keep seeing in AI-assisted frontend work: the first generated page can look good, but it often drifts from the supplied reference.

I packaged the workflow as an open-source Agent Skill. It asks the agent to inspect the Figma/URL/screenshot and the existing codebase first, derive the design tokens and component structure, implement in the current stack, and then verify with screenshots and QA tools where available.

Install:
`npx skills add tgkjuanda/reference-driven-ui-engineering`

Source:
https://github.com/tgkjuanda/reference-driven-ui-engineering

I’d especially appreciate feedback on the installation flow, the usefulness of the screenshot comparison workflow, and which frontend stacks or agent environments should be tested next.

**Before posting:** read the current rules of the specific community. Some communities restrict self-promotion or only allow project posts in designated threads. Do not cross-post identical promotional copy to unrelated subreddits.

## Dev.to article outline

**Suggested title:** From Figma Screenshot to Verified UI: Building a Reference-First Workflow for AI Coding Agents

Suggested structure:
1. Why plausible UI is not the same as reference fidelity.
2. The evidence-first workflow: inspect reference, inspect repo, map tokens/components.
3. Why responsive, accessibility, and interaction states are part of fidelity.
4. Screenshot capture and visual difference diagnostics.
5. What pixel-diff can and cannot tell you.
6. Installation and a short walkthrough.
7. Limitations: Figma permissions, browser access, dynamic data, and manual review.
8. Invite developers to test and open issues with concrete examples.

The article should include real screenshots from an actual run. Do not claim results or percentage improvements without recorded measurements.

## Show HN preparation — not a ready-to-post script

Potential title, only after the project is easy for strangers to try:
`Show HN: UI Reference Replication — an Agent Skill for reference-led UI and visual QA`

Before posting:
- Verify the one-command install in a clean temporary project.
- Record a short example with a supplied reference and a real frontend implementation.
- Make the example project runnable without a signup.
- Be available to explain technical decisions and limitations.
- Write the post in your own voice and describe what you personally built.
- Do not ask friends to upvote or coordinate votes.

If the demo is not genuinely usable by strangers yet, use a normal project discussion or wait rather than posting a Show HN.

## Demo video storyboard (60–90 seconds)

1. **0–8s — The problem:** show a Figma frame beside a UI that looks plausible but is visibly different.
2. **8–18s — Install:** show the one-command Skills CLI installation.
3. **18–30s — Reference intake:** give the agent a Figma frame or screenshot and show its evidence inventory.
4. **30–45s — Implementation:** show the agent inspecting the project, deriving tokens/components, and building the screen.
5. **45–60s — QA:** show same-viewport screenshots, raw diff, heatmap, and one detected mismatch.
6. **60–75s — Correction:** show the agent fixing the responsible component/token and re-running the capture.
7. **75–90s — Result:** show before/after plus actual test output and remaining limitations.

Use a real run, real outputs, and a real reference that you are authorized to share.

## Distribution sequence

1. Ensure the README, install command, clean-install test, and sample are ready.
2. Confirm the skill appears on skills.sh after normal CLI installation/indexing; use the official badge/link.
3. Publish a detailed technical walkthrough on Dev.to or a personal blog with a real demo.
4. Share a short clip on X/Threads and LinkedIn, each with platform-appropriate framing.
5. Submit to Product Hunt when the product page/demo is clear and testable.
6. Share in relevant Reddit/Discord communities only where current rules permit project feedback posts.
7. Consider Show HN only after strangers can install and run the example, and the maker can actively respond.

## Metrics to track weekly

- Skills CLI installs / skills.sh install count (where surfaced).
- GitHub stars, forks, unique visitors, and issues.
- Clean-install success rate across agents.
- Time to first successful screenshot.
- Number of reproducible user examples.
- Visual-QA defects detected and corrected in real demos.
- Accessibility findings confirmed and resolved.

Do not buy installs, manipulate leaderboards, ask for fake stars, or use coordinated upvotes. Aim for genuine installs and useful feedback.

## GitHub About metadata to set manually

The connected GitHub tool can commit repository files but does not expose the repository About/topics update action. Set these on the GitHub repository page:

**Description:**
Agent Skill to rebuild UI from Figma, websites, and screenshots, then verify visual fidelity with automated QA.

**Suggested topics:**
`agent-skills`, `figma`, `ui-ux`, `design-to-code`, `frontend`, `visual-regression-testing`, `accessibility`, `responsive-design`, `playwright`, `skills-sh`

## Claims policy

Only claim capabilities that have evidence:
- Say “helps reconstruct” rather than “guarantees pixel-perfect.”
- Say “axe-core automated scan” rather than “WCAG certified.”
- Say “supports DTCG-oriented validation” rather than “fully DTCG compliant” unless a full conformance validator is run.
- Distinguish repository CI from visual QA on a consumer project.
