# Design Tokens and Component Engineering

## Token architecture

Use a canonical token source rather than isolated CSS literals. Separate:
- Primitive tokens: raw palette, dimensions, type scale, and shadow values.
- Semantic tokens: surface, text, border, primary action, focus, status, and spacing roles.
- Component tokens: documented exceptions for a specific component.

Cover color, typography, spacing, sizing, radius, border, and shadow/elevation where used by the reference.

Prefer token aliases for semantic mapping. Detect unresolved references and circular aliases. Do not replace exact source values with generic defaults without recording the deviation.

## Visual hierarchy

Map:
- Primary user task.
- Primary action.
- Supporting content.
- Secondary actions.
- Metadata and low-priority content.
- Reading order and semantic heading structure.

Preserve the source reference's hierarchy. Improve accessibility barriers with minimal, documented deviations rather than reproducing a defect.

## Component-driven development

Build components around repeated visual and behavioral patterns. For each component, document:
- Anatomy and semantic element.
- Props and variants.
- Token dependencies.
- Visual states.
- Interaction contract.
- Accessibility behavior.
- Screenshot or reference evidence.

Use existing project components where appropriate. Avoid both copy-paste duplication and over-abstraction of unique elements.

A component state matrix should cover applicable default, hover, focus, active, selected, disabled, loading, empty, error, and success states.

## Implementation conventions

- Preserve the current frontend framework.
- Use CSS variables, the project's token system, or the existing theme mechanism.
- Avoid inline style values when a canonical token exists.
- Use semantic HTML and real button/link/form elements.
- Keep state and data separate from presentation when the project architecture supports it.
- Use only supplied or authorized assets.
