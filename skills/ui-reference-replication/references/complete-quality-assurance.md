# Complete Quality Assurance

## Purpose

Combine the Skill's separate checks into one evidence-backed delivery decision. Repository CI validates the Skill and scripts; it does not certify an arbitrary consumer application.

## Required gates

Every task records: visual evidence, perceptual visual review, functional regression, responsive behavior, accessibility, performance, dependency security, and design-system consistency.

Add conditional gates when applicable:
- Existing UI Redesign or Hybrid: preservation of existing behavior and contracts.
- Reference-Inspired Creative: originality, product fit, retained design anchors, and anti-AI-slop review.
- Motion in scope: motion behavior, reduced-motion preference, and performance.

Every gate must be Pass, Partial, Fail, or Not Tested. Pass requires evidence. Partial/Fail require evidence and a next action. Not Tested requires a specific reason. Missing evidence must never be converted into Pass.

## Responsive audit

Requires Playwright and Chromium in the target project:

```bash
npm run responsive:audit -- --url http://localhost:3000 --routes /,/dashboard --viewports 390x844,768x1024,1440x900 --out artifacts/ui-reference/responsive.json
```

It checks document horizontal overflow, mobile viewport metadata, navigation failures, and uncaught page errors. It does not prove visual quality or test every breakpoint interaction. Pair it with the screenshot and visual-review workflow.

## Performance budget audit

Copy the performance-budget example and adjust it to the product's user, device, and network requirements:

```bash
npm run performance:audit -- --url http://localhost:3000 --budget artifacts/ui-reference/performance-budget.json --routes /,/dashboard --out artifacts/ui-reference/performance.json
```

The audit records browser lab TTFB, FCP, LCP, CLS, observed long-task blocking time, and resource transfer sizes. Missing measurements remain Partial/Not Tested. These are not field Core Web Vitals. Observed blocking time is a Long Task approximation, not a Lighthouse TBT replacement. Cross-origin resource sizes may be unavailable without Timing-Allow-Origin.

## Dependency security

For npm projects with a committed package-lock.json or npm-shrinkwrap.json:

```bash
npm run security:audit -- --root . --fail-on high --out artifacts/ui-reference/dependency-audit.json
```

The script summarizes npm audit JSON; it never installs packages or modifies the lockfile. It checks dependency advisories only. It is not source-code SAST, secret scanning, infrastructure review, or penetration testing. Use the target project's approved security tooling for those checks.

## Unified quality report

Start from the quality-report template. Replace placeholders with actual results and evidence paths, then validate:

```bash
npm run validate:quality-report -- --file artifacts/ui-reference/quality-report.json --root .
```

The validator checks required gate coverage for the declared work/fidelity mode, status semantics, evidence-file existence, and path containment. Pass, Partial, and Fail each require at least one existing evidence file. Partial/Fail additionally require a next action. Not Tested requires a reason.

The validator checks structure and evidence references. It does not execute Playwright, npm audit, axe-core, or visual inspection and cannot prove an agent's declarations are truthful. Keep original test reports and screenshots alongside the aggregate report.

## Cost and token controls

- Reuse one route/viewport/state matrix across capture, responsive audit, and visual review.
- Reuse baseline reports when code and environment are unchanged; invalidate only affected evidence after relevant changes.
- Store full machine output in artifacts; bring concise summaries and failing excerpts into model context.
- Run targeted checks during iteration, then the complete required matrix before delivery.
- Never omit a required gate solely to reduce token or compute cost.
