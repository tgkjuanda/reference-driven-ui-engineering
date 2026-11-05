---
name: ui-reference-replication
description: Reconstruct high-fidelity, responsive web UI from user-provided design references including Figma links, website URLs, screenshots, and images. Analyze visual structure, extract design tokens and assets, implement the existing project's frontend stack, and verify the result with browser screenshots and iterative visual comparison.
license: MIT
compatibility: opencode
metadata:
  domain: frontend-engineering
  workflow: reference-to-ui
---

# UI Reference Replication

## Mission

Reconstruct the user-provided interface reference as a working frontend implementation with the highest practical visual fidelity.

Treat the supplied reference as the source of truth. Do not replace its visual language with a generic dashboard, trendy redesign, or personal aesthetic preference.

The target is faithful reproduction, not merely a page with similar subject matter. Match visible layout, proportions, typography, colors, spacing, borders, shadows, icons, imagery, density, and responsive behavior as closely as the available evidence permits.

Use this skill whenever the user provides or refers to:
- A Figma community file, Figma design URL, or Figma prototype.
- A live website URL to reproduce.
- One or more screenshots, mockups, wireframes, or design images.
- A reference interface and asks to build, clone, recreate, reproduce, or implement it.

## Non-negotiable principles

1. **Reference first.** Every significant visual decision must be grounded in an inspected reference or explicitly identified as an assumption.
2. **Evidence before implementation.** Inspect all accessible pages, frames, states, and supplied images before writing the main UI.
3. **No invented fidelity.** Never claim exact or pixel-perfect reproduction without comparable screenshots and measured verification.
4. **Preserve the project.** Inspect the existing repository and follow its framework, conventions, dependencies, routing, and component patterns. Do not replace the stack without approval.
5. **Do not fake inaccessible data.** If a URL, Figma frame, image, or asset cannot be inspected, state the limitation and request the minimum missing input.
6. **Separate structure from content.** Reproduce the visible layout and design system while using realistic, clearly synthetic content when original content is unavailable.
7. **Respect rights and access.** Use assets supplied by the user or assets they are authorized to use. Do not bypass authentication, paywalls, access controls, or licensing restrictions. Do not redistribute proprietary source files.
8. **Functional UI matters.** Controls that look interactive should work or be explicitly marked as non-functional placeholders when backend behavior is outside scope.
9. **Responsive behavior must be reasoned from evidence.** Inspect multiple reference widths where available. If only desktop is supplied, derive mobile behavior conservatively and document inferred changes.
10. **Verify continuously.** Use browser screenshots, inspect console/build output, compare against the reference, and iterate.

## Required workflow

### Phase 0 — Intake and scope

Identify:
- Reference type: Figma URL, live website URL, screenshot/image, or mixed.
- Target scope: one screen, selected screens, or the complete accessible design.
- Target implementation: existing repository or new project.
- Required viewport(s): use the reference's native dimensions when known; otherwise ask only if it materially affects the result.
- Functional scope: visual-only prototype or working interactions/data flows.

If the user provides a URL and screenshots, treat both as evidence. The screenshot can clarify a frame that the URL does not expose.

Do not ask questions whose answers can be determined by inspecting the repository or reference. If a critical detail is unavailable, ask one concise question or proceed with a clearly labeled assumption.

### Phase 1 — Inspect the implementation environment

Before editing:
1. List and inspect the repository structure.
2. Read `package.json`, lockfiles, framework config, route definitions, styling config, and existing app entry points.
3. Identify framework and versions (for example React, Next.js, Vue, Nuxt, Vite).
4. Identify existing UI libraries, icon libraries, fonts, CSS conventions, and test/browser tooling.
5. Identify existing reusable components and assets.
6. Determine how the app is started and how screenshots can be captured.

Rules:
- Prefer the current stack and installed dependencies.
- Do not install a large UI framework merely to reproduce a reference.
- Do not overwrite working application code before understanding it.
- If the repository is empty, select the smallest appropriate stack and explain the choice briefly.

### Phase 2 — Acquire and inspect references

#### A. Figma URLs

1. Open the supplied Figma URL using an available browser or Figma integration.
2. Inspect the public preview, page/frame list, thumbnails, dimensions, and all visible screens.
3. If authorized Figma API/MCP access exists, use it to inspect node hierarchy, frame bounds, text styles, fills, strokes, effects, component instances, variables, and exported assets.
4. If the Figma file is inaccessible or requires authentication, do not pretend to have inspected it. Ask the user for one of:
   - screenshots of the relevant frames,
   - exported PNG/JPG/PDF,
   - authorized Figma access or a permitted export.
5. Never bypass Figma access restrictions or download controls.

#### B. Live website URLs

1. Open the URL in a browser capable of rendering the page.
2. Wait for fonts, images, and layout to settle.
3. Inspect the full page, not only the initial viewport.
4. Capture screenshots at relevant viewport sizes.
5. Inspect hover, focus, active, expanded, modal, dropdown, and navigation states when relevant and accessible.
6. Record visible navigation destinations and interaction behavior.
7. Do not use a textual search result or page description as a substitute for visual inspection.

#### C. Screenshot and image references

1. Inspect every supplied image at its original resolution where possible.
2. Record image dimensions and aspect ratio.
3. Identify viewport boundaries, page background, content container, columns, alignment, spacing, typography, colors, shadows, borders, icons, and image crops.
4. Distinguish observed facts from estimates.
5. If text or details are too small to read, do not invent them; use a neutral placeholder or ask for a higher-resolution image.

#### Reference inventory

Create a concise inventory before implementation:

| Screen | Reference source | Viewport/frame | Visible sections | States | Confidence |
|---|---|---|---|---|---|

Confidence values:
- High: directly inspectable, dimensions/styles/assets available.
- Medium: screenshot clearly shows appearance, some measurements inferred.
- Low: partial, compressed, obscured, or inaccessible reference.

### Phase 3 — Reverse-engineer the design system

Build a reference-derived design specification. Record:

#### Layout
- Canvas and viewport dimensions.
- Main content max-width and page gutters.
- Sidebar width, header height, navigation dimensions.
- Grid columns, rows, gaps, alignment, and section boundaries.
- Card dimensions, table density, chart dimensions, and scroll behavior.
- Fixed, sticky, and scrolling regions.

#### Visual tokens
Extract observed values where possible:
- Color palette: page background, surfaces, text, muted text, primary, secondary, accent, border, status colors.
- Typography: font family, weights, sizes, line heights, letter spacing.
- Spacing scale and component padding.
- Border widths, radii, shadows, and elevation.
- Icon family, size, stroke/fill style.
- Image aspect ratios, crop behavior, and object positioning.

Use exact values from Figma or CSS when available. When estimating from screenshots, record estimates and confidence; do not present estimates as source facts.

Create a token file (CSS variables, Tailwind theme, or the project's existing token format) rather than scattering values across components.

#### Component inventory
Identify reusable patterns such as:
- App shell, sidebar, topbar, breadcrumbs.
- Buttons, inputs, selects, tabs, badges, tooltips.
- Cards, tables, charts, calendars, lists.
- Modals, drawers, dropdowns, pagination.
- Empty, loading, error, and selected states.

Map each reference component to an implementation component. Preserve visual differences between variants.

#### Asset inventory
List:
- Logos and brand marks.
- Illustrations, avatars, photos, thumbnails.
- Icons and icon sets.
- Fonts.
- Charts or other visual assets.

Prefer supplied/exported assets. Do not approximate a distinctive logo or illustration with generic emoji or unrelated stock imagery. If the exact asset is unavailable, use a close, legally usable substitute and disclose it.

### Phase 4 — Plan before coding

Create a short implementation plan:
1. App shell and global design tokens.
2. Shared components.
3. Page/screen layout.
4. Content and data.
5. Interactions and states.
6. Responsive adaptations.
7. Visual verification.

Map the plan to actual files and routes. Keep components reusable but do not over-engineer a one-screen prototype.

### Phase 5 — Implement

1. Follow the existing framework and conventions.
2. Implement global typography, colors, sizing, and layout first.
3. Build the page shell and major geometry before fine details.
4. Implement reusable components and variants.
5. Match exact text where legible in the reference.
6. Use the supplied assets and appropriate icon set.
7. Match image crops and aspect ratios.
8. Implement realistic interactions for visible controls:
   - navigation,
   - tabs,
   - dropdowns,
   - search/filter,
   - pagination,
   - modal/drawer,
   - forms and validation,
   - responsive sidebar/menu.
9. Use mock data only when real data/backend is not provided. Keep mock data coherent and label it in code where appropriate.
10. Avoid adding unrelated sections, gradients, animations, charts, or decoration not present in the reference.

Do not:
- substitute a generic dashboard template,
- change the reference's information hierarchy,
- arbitrarily change colors or fonts,
- use emoji as a substitute for interface icons,
- use random Unsplash images when exact assets are supplied,
- add visual elements solely to make the design look more modern.

### Phase 6 — Visual verification and iteration

Visual verification is mandatory when browser/screenshot tooling is available.

1. Run the app using the repository's existing scripts.
2. Open the implementation in a browser.
3. Set the same viewport dimensions as the reference.
4. Capture a screenshot of the same screen and state.
5. Compare reference and implementation side by side or with an overlay/difference image when tooling supports it.
6. Fix the largest discrepancies first:
   - overall geometry and alignment,
   - sidebar/header/content proportions,
   - typography and line wrapping,
   - colors and surfaces,
   - component dimensions and spacing,
   - icons and assets,
   - subtle borders and shadows.
7. Repeat until the remaining differences are minor or tooling/reference limitations prevent further progress.
8. Test other supplied viewports and key interaction states.
9. Check console errors, failed asset requests, build errors, and responsive overflow.

If browser screenshot tooling is unavailable:
- run the available build/type/lint checks,
- explain that visual comparison could not be performed,
- do not claim pixel-perfect completion,
- provide exact commands or steps for the user to capture screenshots.

### Phase 7 — Final report

Report:
1. Reference(s) inspected and screens covered.
2. Files/routes created or changed.
3. Design tokens and assets reused.
4. Interactions implemented.
5. Viewports tested.
6. Build/test results.
7. Visual comparison status and known deviations.
8. Any assumptions, unavailable assets, or access limitations.

Use precise status labels:
- **Verified:** directly tested or measured.
- **Implemented, not visually verified:** code exists but screenshot comparison was not possible.
- **Estimated:** inferred from incomplete visual evidence.
- **Blocked:** required reference or access unavailable.

Never claim "100% identical", "pixel-perfect", "all screens reproduced", or "fully tested" unless the evidence supports that exact claim.

## Visual fidelity priority

When time is limited, prioritize in this order:

1. Macro layout and geometry.
2. Major color fields and contrast.
3. Typography and text wrapping.
4. Component dimensions and spacing.
5. Images, logos, and icons.
6. Borders, shadows, and micro-details.
7. Motion and transitions.

Do not polish a small icon while the sidebar width or main content alignment is still wrong.

## Acceptance checklist

Before declaring completion, verify:

- [ ] Correct page and screen scope.
- [ ] Correct overall layout and hierarchy.
- [ ] Sidebar/header/content dimensions closely match.
- [ ] Typography, line wrapping, and font weights match.
- [ ] Colors and surfaces match the reference.
- [ ] Spacing, borders, radii, and shadows match.
- [ ] Supplied assets are used where available.
- [ ] No unrelated design elements were introduced.
- [ ] Visible controls behave appropriately.
- [ ] No horizontal overflow at tested viewports.
- [ ] App builds/runs without blocking errors.
- [ ] Screenshot comparison performed or limitation disclosed.
- [ ] Final report distinguishes verified facts from estimates.

## Reference-specific instruction

For the SchoolHub example reference:
`https://www.figma.com/community/file/1381931496411280342/schoolhub-school-management-admin-dashboard-template`

Treat this URL as a user-provided reference, not as proof that all frames or source assets are accessible. Inspect the actual preview/file first. Only implement screens that can be inspected or that the user explicitly supplies. Do not invent the unseen screens. Confirm the user's rights/license before reusing proprietary exported assets in a distributed product.

## Operating behavior

- Start by inspecting the reference and repository; do not immediately generate generic code.
- If multiple references conflict, ask which one is authoritative or follow the user's stated priority.
- If the user says "exact", maximize fidelity and explain any unavailable evidence or assets.
- If the user says "similar", preserve the reference's visual language while allowing only the requested changes.
- If the user asks for a redesign, distinguish redesign from faithful replication and get approval before changing the visual system.
- Keep the user informed at meaningful decision points, not with repetitive progress messages.
