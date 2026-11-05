# Design Intelligence and Figma-to-Code Mapping

## Purpose

Make the Figma-to-code relationship inspectable and repeatable. A map records where selected Figma variables and components are represented in the implementation, while a drift report records known gaps.

## Mapping workflow

1. Select the exact Figma file, page, frame, and revision used as evidence.
2. Map only variables and components relevant to the requested screens; do not export the entire design library by default.
3. Record the code token, component name, and implementation file for every mapped item.
4. Record variants and Code Connect availability without assuming that a label means the integration is configured.
5. Maintain drift lists for missing tokens, changed Figma values, unmapped components, missing variants, and visual differences.
6. Validate the map against the actual project files:

```bash
npm run validate:design-map -- --file artifacts/ui-reference/figma-code-map.json --root .
```

## Interpretation

- Pass means every declared mapped token/component reference exists in the referenced code files and the declared drift lists are empty.
- Partial means mappings or drift items remain unresolved.
- Fail means the mapping is malformed, a declared mapped item cannot be found, a code path is missing, or a path escapes the project root.
- Unmapped and partial entries are retained as findings; do not convert them to mapped to improve the status.

## Token-efficiency controls

- Map only the frames, variables, components, and variants in task scope.
- Read Figma metadata only when it resolves a real code-mapping question.
- Reuse the map while the Figma revision and code files remain unchanged.
- Revalidate only affected mappings after targeted implementation changes.
- Do not load all Figma nodes or serialize entire design documents into model context when a small scoped map is sufficient.

## Limits

The validator checks the declared file paths and searches code files for declared token/component identifiers. It does not call Figma, verify live variable values, compute design drift from Figma automatically, or prove that Code Connect is synchronized. Those steps require an authorized Figma connection and direct project inspection.
