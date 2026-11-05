# Token-Efficient Execution

## Purpose

Reduce unnecessary model context, repeated analysis, and avoidable tool calls without weakening visual, functional, accessibility, security, or regression checks.

Token efficiency is a quality constraint, not permission to skip required evidence.

## 1. Load context progressively

1. Read the core `SKILL.md` and the mandatory `visual-capability-gate.md`.
2. Run `scripts/plan-task.mjs` with the selected work mode, fidelity mode, and relevant task flags.
3. Read only the references listed under **Read before implementation**.
4. Keep other references in **Load only when needed** until their subject is in scope.
5. Do not load every reference file simply because it exists.

When the planner is unavailable, apply the same routing rules manually. Never skip the visual-capability prerequisite.

## 2. Route by task, not by repository size

- Existing UI redesign or hybrid work: read `existing-ui-redesign.md`.
- Reference-Inspired Creative: read both `creative-reference-mode.md` and `anti-ai-slop.md`.
- Figma-driven work: read `figma-analysis.md`.
- Motion in scope: read `motion-design.md`.
- Accessibility implementation/audit: read `accessibility.md`.
- Responsive and interaction implementation: read `responsive-and-interactions.md`.
- Token/component engineering: read `design-system-engineering.md`.
- Screenshot comparison and discrepancy correction: read `visual-qa.md` and `evidence-and-visual-qa.md`.

A route decision is based on task scope. Do not infer that a reference is Figma-based or that motion is required when the user has not supplied that requirement.

## 3. Reuse verified context

- Maintain a compact task ledger: modes, target routes, viewports, critical states, protected behavior, references read, and unresolved unknowns.
- Record stable inspection findings once and refer to the ledger rather than repeating the same scan.
- Re-read a file only when it changed, a relevant section was omitted, or new evidence contradicts the earlier result.
- Do not paste full logs into model context when a script can return a concise summary plus the relevant error excerpt.
- Do not re-run a successful deterministic check after unrelated documentation-only changes unless its inputs or script changed.

Context reuse applies within the active task/session. Do not assume memory or tool state persists across independent sessions.

## 4. Automate deterministic work

Prefer scripts for:
- Project inventory and dependency detection.
- Token structure validation.
- Screenshot capture and manifest generation.
- Pixel-difference diagnostics.
- Automated accessibility scans.
- Unit, build, lint, type, and regression tests already configured by the project.

Use model reasoning for design intent, visual interpretation, trade-offs, ambiguous behavior, and root-cause analysis. A script result is evidence only for what that script actually checks.

## 5. Keep evidence compact and sufficient

- Select routes, viewports, and states based on risk and user-visible importance.
- Reuse the same screenshot manifest and route/state identifiers across capture, review, and retest.
- Prefer targeted excerpts, structured summaries, and contact sheets when each image remains legible.
- Preserve access to original evidence; a summary does not replace the source screenshot, test report, or error log.
- Expand coverage for critical flows, complex layouts, breakpoints, and failures rather than uniformly capturing every possible combination.

Never reduce coverage below the project's risk needs solely to save tokens.

## 6. Bound iteration by verified impact

1. Rank defects by severity and user impact.
2. Fix the highest-impact confirmed issue first.
3. Change the smallest responsible code surface.
4. Re-capture or re-test only the affected scope plus necessary regression sentinels.
5. Stop when acceptance criteria pass, remaining issues are documented, or a concrete blocker prevents further verification.

Do not repeat visual edits based on vague dissatisfaction without identifying a specific defect or design objective.

## 7. Report efficiency honestly

Report:
- Work/fidelity mode and scope.
- References actually read.
- Routes/viewports/states actually inspected.
- Tools and tests actually run.
- Known checks not run and why.
- Context/token usage only when the host runtime exposes reliable measurements.

Do not invent token counts, cost savings, model-call totals, or percentage improvements. The planner reduces unnecessary context loading; it does not measure provider billing or guarantee a fixed token reduction.
