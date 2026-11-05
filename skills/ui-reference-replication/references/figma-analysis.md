# Figma MCP Integration Guide

## What the integration actually provides

Figma MCP is a context bridge between Figma and an AI client. It can expose structured design information and, on supported clients/servers, write design content. It does not automatically convert a design into production-ready frontend code or repair implementation defects; the Agent is responsible for implementation, component reuse, and validation.

Official setup documentation: https://developers.figma.com/docs/figma-mcp-server/

## Recommended read workflow

When the host agent exposes the official Figma MCP tools, use the capabilities that are actually available:

1. `get_metadata`: discover top-level pages and inspect IDs, names, node types, positions, and dimensions. Use this first for large files.
2. `get_design_context`: retrieve selected frame/layer design context, including structure and styling. Request the target framework and existing project components in the prompt.
3. `get_variable_defs`: extract variables and styles used in the selected Figma scope.
4. `get_screenshot`: capture the selected frame for visual inspection and comparison.
5. `download_assets`: retrieve exports or original image assets when the implementation needs actual files.
6. `get_code_connect_map`: retrieve mappings between Figma instance nodes and code components.
7. `get_code_connect_suggestions`: request suggestions when mappings are missing.
8. `get_motion_context`: inspect keyframe/easing data for animated designs when available.

Tool availability varies by server mode, client, selection type, and account permissions. Discover tools from the connected MCP rather than assuming every method is enabled.

## Remote Figma MCP setup

The official remote MCP endpoint documented by Figma is:

```text
https://mcp.figma.com/mcp
```

Follow the host AI client's own MCP connection instructions. The desktop MCP server is a separate option and has different selection/context behavior. Remote server capabilities also differ from desktop capabilities.

For remote context extraction, provide a link to the relevant Figma frame or layer. Selection-based prompts are supported by the desktop MCP server; remote MCP expects a frame/layer link.

## Required extraction record

For each target screen, record:
- File key, page ID, node/frame ID.
- Inspected revision/time if exposed.
- Canvas/frame dimensions.
- Layout, Auto Layout, constraints, spacing, and alignment.
- Variables, typography, effects, strokes, fills, and radii.
- Component instances, variants, and Code Connect mappings.
- Screenshot/export references and source asset names.

## Figma-to-code synchronization

Use a traceable mapping:
Figma variable or node ID → semantic token/component → source file and export.

On each change:
1. Re-read only affected Figma nodes/variables.
2. Compare against the previous mapping.
3. Generate a drift report.
4. Review the impact on shared components and other viewports.
5. Apply the smallest code correction.
6. Re-run screenshots and relevant tests.

Default direction is Figma → code. Do not write changes back to Figma unless the user explicitly asks and the connected tool has authorized write access. If writing back is requested, inspect first, present the planned change, and avoid replacing shared components/variables wholesale.

## Limitations

- MCP output quality depends on the design file structure, selected scope, available variables, model, and prompt.
- Very large frames may need to be inspected in smaller sections.
- Exported assets and write operations depend on available Figma MCP capabilities and permissions.
- A Figma MCP connection does not automatically provide browser automation, Playwright, axe-core, or access to the user's local files unless the host agent separately provides those capabilities.
