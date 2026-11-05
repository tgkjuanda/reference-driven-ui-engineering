# Responsive, Performance, and Security QA

## Purpose

Provide repeatable, scoped checks for common frontend quality risks. These tools are supporting evidence and must not be presented as complete UX, performance, or security certification.

## 1. Responsive overflow audit

Use a project-owned route/viewport matrix. Start from `templates/responsive-audit.example.json`:

```bash
npm run audit:responsive -- --config tests/responsive-audit.json --out artifacts/ui-reference/responsive.json
```

The Playwright audit checks:
- Document/body horizontal scroll width against the viewport.
- Visible elements extending beyond the viewport.
- HTTP error responses.
- Each declared route and viewport independently.

The config may declare intentional overflow using:
- `data-qa-allow-overflow` for a specifically approved element.
- `data-qa-scroll-container` for an intentional horizontal/vertical scrolling region.

Use these exclusions narrowly and document why overflow is intentional. The script does not judge visual hierarchy, touch ergonomics, readability, or whether the responsive composition is good. Direct visual inspection remains mandatory.

## 2. Lab performance budgets

Start from `templates/performance-budget.example.json`:

```bash
npm run audit:performance -- --config tests/performance-budget.json --out artifacts/ui-reference/performance.json
```

Measured metrics:
- First Contentful Paint (FCP).
- Largest Contentful Paint (LCP), when a measurable candidate is observed.
- Cumulative Layout Shift (CLS), observed during the configured page-load window.
- DOM node count.
- Resource count.
- Approximate transferred bytes from browser resource/navigation entries.

Defaults are starter guardrails, not universal standards. Set route budgets from the actual product, environment, and target devices. Missing metrics are `not-measurable` and produce a Partial result rather than a fabricated pass.

**Limitations:** these are browser lab diagnostics. Results vary with browser, device, CPU, network, cache, consent banners, third-party scripts, data, and test timing. This helper does not collect field Core Web Vitals, does not measure INP, and is not a substitute for Lighthouse/CrUX/RUM or performance profiling. Do not label lab LCP/FCP/CLS as field metrics.

## 3. Frontend source and dependency security review

Run:

```bash
npm run audit:security -- --root . --out artifacts/ui-reference/security.json
```

The dependency-free source scan checks selected JS/TS/Vue/Svelte/HTML files for:
- Potentially risky dynamic HTML or script execution APIs.
- Selected common secret/token formats.

If `package-lock.json` exists, it also attempts `npm audit --omit=dev --json` for production dependencies. Use `--no-dependency-audit` to skip registry access when dependency auditing is intentionally unavailable; the report remains Partial when it was not run.

Security output includes path, line, category, and a redacted message. It must never print the suspected secret value. Treat findings as leads for manual review: context may make an API safe or unsafe, and false positives are possible.

**Limitations:** this is a lightweight source-pattern and npm dependency check. It is not full SAST, DAST, a threat model, secrets-manager audit, infrastructure scan, or penetration test. It detects only selected file types and token formats. A clean result does not prove absence of vulnerabilities or secrets.

## 4. Reporting rules

For every audit record:
- Exact project root, routes, viewports, and budgets.
- Tool and dependency availability.
- Pass, Partial, or Fail result with concise evidence.
- Any excluded intentional overflow and the reason.
- Lab versus field measurement distinction.
- Security scanner scope and any dependency audit not run.
- Remaining manual checks.

Never convert a blocked or unmeasurable check into Pass. Do not upload raw reports containing personal data, internal URLs, or sensitive project details without sanitization.
