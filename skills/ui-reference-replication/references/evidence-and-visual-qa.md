# Evidence Capture and Visual QA

Use this worksheet for every referenced screen.

## Evidence capture worksheet

- Reference URL/file:
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
3. Main content position and grid.
4. Card/table/chart sizes.
5. Font family, size, weight, and line-height.
6. Text wrapping and alignment.
7. Color, border, radius, and shadow.
8. Icon size, stroke, and placement.
9. Image source, crop, and aspect ratio.
10. Responsive and interaction states.

## Practical browser workflow

Use the browser/screenshot tool actually available in the host agent. Tool names vary by agent and installed extensions/MCPs. Do not assume a browser tool exists.

If Playwright is installed in the project, use its existing configuration and scripts. Avoid adding dependencies without need. Capture reference and local implementation at identical viewport dimensions.

## Figma access checklist

- Public preview visible?
- All relevant frames visible?
- Frame dimensions available?
- Text and style properties inspectable?
- Exported assets available?
- Figma API/MCP access authorized?
- License/usage rights confirmed?

If a required item is unavailable, report it and request the relevant export or screenshot.
