# Reference Intelligence and Design Reverse Engineering

## Evidence precedence

Use this order when sources disagree:
1. Explicit user instruction about the authoritative source.
2. Authorized structured design data (Figma nodes, variables, component properties).
3. Exact supplied frame export or screenshot.
4. Live rendered reference at the matching state/viewport.
5. Clearly labeled inference.

Never let a low-confidence screenshot estimate override an exact Figma variable.

## Figma inspection

When an authorized Figma MCP/API connection is available, use the tools it actually exposes. Common Figma MCP capabilities include design context, variable definitions, component/variant inspection, Code Connect maps, and asset downloads. Tool availability differs by MCP version and plan.

For each target frame:
- Record file, page, frame/node IDs and revision/timestamp when available.
- Inspect the frame hierarchy and selected node bounds.
- Extract Auto Layout direction, gap, padding, alignment, sizing mode, constraints, and clipping.
- Extract text content, font family, size, weight, line height, letter spacing, text alignment, and text resizing.
- Extract fills, strokes, opacity, corner radius, effects, and blend modes.
- Inspect component properties, variants, nested instances, variables, and modes.
- Identify image fills, vector assets, icon sources, and export settings.
- Prefer existing project components using Code Connect mappings where available.

A Figma MCP server supplies structured context; it does not one-click produce correct production code. The agent remains responsible for mapping the context to the repository and validating the rendered result.

## URL and screenshot inspection

For a website:
- Capture the full page and required states.
- Inspect at source-like viewport dimensions.
- Wait for fonts and image loading.
- Record visible navigation destinations and behavior.

For screenshots:
- Preserve original dimensions.
- Record viewport boundaries and any browser chrome/cropping.
- Estimate positions proportionally only when exact node data is unavailable.
- Mark unreadable text and unseen content as unknown.

## Evidence ledger

For every screen, create records with:
- Reference source and stable identifier.
- Viewport and UI state.
- Observed facts.
- Inferred values and confidence.
- Missing evidence/assets.
- Implementation route/component mapping.

## Figma-to-code synchronization

Maintain a mapping:
Figma variable/component/node → semantic token/code component → source file/export.

Detect:
- Changed token values.
- Missing or unused code tokens.
- Unmapped Figma components.
- Missing code variants.
- Visual drift after a design revision.

Default direction is Figma/reference → code. Only write to Figma after explicit user direction and verified write permission. Generate a diff before changing shared libraries.
