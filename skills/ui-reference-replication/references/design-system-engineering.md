# Design System and Component Engineering

## Token architecture

Use a canonical token source rather than isolated CSS literals. Separate:
- Primitive tokens: raw palette, dimension, type scale, shadow values.
- Semantic tokens: surface, text, border, primary action, focus, status, spacing roles.
- Component tokens: only when a specific component needs a documented exception.

Cover color, typography, spacing, sizing, radius, border, shadow/elevation, breakpoints, and motion when present in the source.

Use DTCG Format Module 2025.10 as a portable interchange target where practical. It is a Design Tokens Community Group specification, not a W3C Recommendation. Do not claim full conformance without schema/spec-aware validation.

Prefer token aliases for semantic mapping. Detect unresolved references and circular aliases. Never replace exact source values with generic defaults without recording that change.

## Visual hierarchy

Map:
- Primary user task.
- Primary action.
- Supporting content.
- Secondary actions.
- Metadata and low-priority content.
- Reading order and semantic heading structure.

Preserve the reference hierarchy. Improve accessibility barriers with minimal, documented deviations rather than reproducing a defect.

## Component-driven development

Build components around repeated visual and behavioral patterns. For each component, document:
- Anatomy and semantic element.
- Props and variants.
- Token dependencies.
- Visual states.
- Interaction contract.
- Accessibility behavior.
- Source Figma component or screenshot evidence.

Use existing project components where appropriate. Avoid both copy-paste duplication and over-abstraction of unique artwork.

A component state matrix should cover applicable default, hover, focus, active, selected, disabled, loading, empty, error, and success states.

## Implementation conventions

- Preserve the current frontend framework.
- Use CSS variables, the project's token system, or the existing theme mechanism.
- Avoid inline style values when a canonical token exists.
- Use semantic HTML and real button/link/form elements.
- Keep state and data separate from presentation when the project architecture supports it.
- Keep assets local and authorized.
