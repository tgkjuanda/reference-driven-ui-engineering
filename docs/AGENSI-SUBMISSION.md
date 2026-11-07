# Agensi Listing Record — Community Edition

## Publication status

**Status: Published as a Free skill on Agensi.**

- Marketplace listing: https://www.agensi.io/skills/ui-reference-replication-community
- Canonical source repository: https://github.com/tgkjuanda/reference-driven-ui-engineering
- AISKILL product page: https://aiskill.my.id/#featured
- Community source version: **4.0.3**
- Marketplace price: **Free**

The live Agensi page currently displays the listing as Free and security-scanned. This record describes the published listing; it is not a substitute for Agensi's own moderation and security decisions.

## Published listing identity

**Name**

UI Reference Replication — Community

**Summary**

Recreate web interfaces from screenshots, Figma designs, mockups and live references using a structured frontend workflow with visual analysis, responsive implementation and evidence-based UI quality checks.

**Positioning**

The Community Edition is a reference-faithful UI engineering workflow. It treats the supplied source as the visual specification and does not introduce an independent creative direction.

## Published capabilities

- Reference analysis for screenshots, Figma frames/exports, mockups, wireframes and accessible live pages.
- Inspection of the target project's framework, routes, components, styles and design tokens.
- New Build, Existing UI Redesign and Hybrid work modes.
- Implementation in the target project's existing stack while preserving existing behavior.
- Screenshot capture and side-by-side visual comparison where the local environment supports the required tools.
- Responsive checks, design-token validation and basic accessibility diagnostics.

## Requirements shown on the listing

- Node.js 20+ (optional local helper scripts).
- Python 3.12+ (optional screenshot QA helper).
- A visual-capable coding agent with project-file access and browser/preview access.

The optional scripts are not prerequisites for loading the Skill. Agent visual-inspection capability is required for the core workflow. Hosted agent environments may not expose the same local helper capabilities.

## Permission disclosure

The published Agensi page currently lists:

- Terminal / Shell
- Browser
- Read Files
- Write Files

These correspond to the workflow's ability to inspect project files, make requested implementation changes, and inspect reference/preview pages. They do not mean the Skill independently grants credentials, unrestricted network access, or authority to modify unrelated projects.

The optional screenshot capture and accessibility helpers use Playwright when installed in the target project. Browser-loaded resources can make their normal network requests. Helper scripts confine project file inputs and outputs to the selected project root and do not install dependencies automatically or run background tasks.

## Limitations

- Requires an agent that can directly inspect both the source reference and rendered implementation.
- Visual fidelity depends on reference quality, available assets, browser rendering and project constraints.
- Screenshots do not automatically provide original source assets or design tokens.
- Pixel-difference output is diagnostic, not a perceptual quality score.
- Playwright, Chromium, Pillow and axe-core are optional environment dependencies for their respective helpers.
- Final visual and functional acceptance requires human review.

## Installation paths

**Agensi:** Use the hosted Free listing at https://www.agensi.io/skills/ui-reference-replication-community.

**GitHub / Skills CLI:**

```bash
npx skills add tgkjuanda/reference-driven-ui-engineering
```

## Website presentation

AISKILL presents Agensi as the primary hosted “Use Free” destination and GitHub as the canonical open-source source / CLI installation path:

https://aiskill.my.id/#featured

Keep these destinations distinct in public copy:
- Agensi listing = hosted discovery and usage.
- GitHub repository = source code, documentation and CLI installation.
- AISKILL = product discovery page linking to both.

## Maintenance checklist

- [x] Public Agensi Free listing is live.
- [x] Listing destination recorded in the Community README.
- [x] Listing summary and Community scope documented.
- [ ] Re-check listing metadata, categories and tags in Creator Studio after any marketplace edits.
- [ ] Replace or extend generic demo material with a real project run and genuine before/after screenshots when available.
- [ ] Keep package version, source README and marketplace package in sync for the next Skill release.
