# Evidence Capture, Responsive QA, Accessibility, and Visual QA

## Evidence capture worksheet

- Reference URL/file:
- Figma file/page/frame/node ID (if available):
- Revision or inspected timestamp:
- Screen/frame name:
- Source viewport:
- Screenshot filename:
- Access method:
- Visible sections:
- Exact measured values:
- Estimated values:
- Missing assets/details:
- Confidence: High / Medium / Low

## Visual comparison checklist

Compare reference and implementation at the same viewport and state:

1. Canvas, page background, and content width.
2. Header and sidebar geometry.
3. Main content position, grid, and information hierarchy.
4. Card/table/chart sizes and content density.
5. Font family, size, weight, and line-height.
6. Text wrapping and alignment.
7. Color, border, radius, and shadow.
8. Icon size, stroke, and placement.
9. Image source, crop, and aspect ratio.
10. Responsive and interaction states.

## Responsive viewport matrix

| Viewport | Evidence type | Layout changes | Overflow checked | Primary action reachable |
|---|---|---|---|---|
| Supplied desktop | Reference | | | |
| Supplied tablet | Reference | | | |
| Supplied mobile | Reference | | | |
| Additional test widths | Implementation test | | | |

Do not label test-only viewport widths as if they were supplied Figma frames.

## Accessibility QA

- Can all primary tasks be completed with keyboard only?
- Is focus visible and in a logical order?
- Are controls named and forms labeled?
- Are errors identified in text and associated with their fields?
- Are status updates announced appropriately?
- Are contrast and target size acceptable?
- Do dialogs manage focus and keyboard dismissal?
- Does zoom/reflow retain all content and functionality?
- Is reduced motion respected?
- Is meaning communicated without relying on color alone?

Record actual test evidence. A checklist that has not been run is not a passed audit.

## Interaction state matrix

| Component | Default | Hover | Focus | Pressed/selected | Disabled | Loading | Empty | Error | Success |
|---|---|---|---|---|---|---|---|---|---|
| Button | | | | | | | n/a | | |
| Text field | | | | n/a | | | n/a | | |
| Select/menu | | | | | | | | | |
| Dialog | | | | | | | | | |
| Data panel | | | | n/a | | | | | |

Adapt this matrix to the components actually present in the reference.

## Figma access checklist

- Public preview visible?
- All relevant frames visible?
- Frame dimensions available?
- Text and style properties inspectable?
- Variables available?
- Component variants available?
- Code Connect mappings available?
- Exported assets available?
- Figma API/MCP access authorized?
- License/usage rights confirmed?

## Practical browser workflow

Use the browser/screenshot tool actually available in the host agent. Tool names vary by agent and installed extensions/MCPs. Do not assume a browser tool exists.

If Playwright is installed in the project, use its existing configuration and scripts. Avoid adding dependencies without need. Capture reference and local implementation at identical viewport dimensions.

If a required reference item is unavailable, report it and request the relevant export or screenshot.


## Machine-checkable visual evidence manifest

Use `templates/visual-evidence.example.json` as the schema example. Each capture pair records:
- Unique capture ID, route, UI state, CSS viewport, and device scale factor.
- Relative path to the authorized reference PNG and implementation PNG.
- A review record identifying the reviewer, timestamp, whether both images were inspected, a concise summary, and findings with severity and status.
- Optional source description for the reference capture.

Validate before delivery:

```bash
node skills/ui-reference-replication/scripts/validate-visual-evidence.mjs \
  --file artifacts/ui-reference/visual-evidence.json \
  --root .
```

The validator rejects missing files, paths escaping the evidence root, malformed PNG headers, mismatched dimensions, duplicate IDs, and incomplete/unreviewed review records. It reports SHA-256 hashes for traceability.

A passing result means the evidence package is structurally complete and contains a declared review record. It does **not** prove that an agent genuinely perceived the images or that its visual judgement was correct. Preserve original screenshots and inspect them directly.
