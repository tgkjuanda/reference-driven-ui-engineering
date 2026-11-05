# Reference-Inspired Creative Design Mode

## Purpose

Use this mode when the user wants a design that is inspired by a reference but does not need to reproduce it exactly. The goal is an original, coherent design that preserves selected qualities of the reference while improving fit for the target product and audience.

This is a **fidelity mode**, independent of the work mode:
- New build + Reference-Inspired Creative.
- Existing UI redesign + Reference-Inspired Creative.
- Hybrid + Reference-Inspired Creative.

The mandatory visual-capability gate remains in force. The agent must visually inspect the reference and its own implementation. A text-only agent must reject the task.

## 1. Distinguish task scope from creative freedom

Keep two decisions separate:

### Work mode
- New build.
- Existing UI redesign.
- Hybrid.

### Fidelity mode
- **Reference-Faithful:** stay close to the source composition, hierarchy, visual language, components, and observable interactions.
- **Reference-Inspired Creative:** preserve selected design qualities but create an original interpretation. Exact layout, component geometry, color values, and motion do not need to match unless the user marks them as fixed.

Do not infer creative freedom merely because the user supplied a reference. Choose Reference-Inspired Creative when the user says "inspired by", "similar style", "make it more creative", "not exactly the same", "use this as direction", or equivalent. Choose Reference-Faithful for "recreate", "replicate", "match", or "as close as possible". If intent is ambiguous and materially affects the design, ask one focused question.

## 2. Create a creative direction brief

Before implementation, create a short brief with four explicit lists:

### Preserve — design anchors
Select the qualities that make the reference recognizable:
- Overall mood/personality (for example calm, editorial, playful, technical, luxurious, bold).
- Broad color family or contrast character, not necessarily exact hex values.
- Typography character and hierarchy, not necessarily the same font.
- Density and rhythm (airy, compact, modular, editorial, data-dense).
- Shape language (soft, geometric, sharp, organic).
- Surface/effect language (flat, layered, restrained glass, tactile, high contrast).
- Illustration, icon, and imagery direction.
- Motion personality (subtle, direct, expressive, cinematic), when observable.

Do not assume every anchor must be preserved. Keep only anchors supported by the reference and relevant to the target product.

### Reinterpret — areas of creative freedom
Define which elements may change:
- Page composition and grid.
- Component shapes, proportions, and arrangements.
- Exact palette shades and semantic color mapping.
- Typography pairing and type scale.
- Illustrations, icons, and original visual assets.
- Gradients, textures, shadows, blur, and other effects.
- Motion choreography, easing, and transitions.
- Responsive composition and navigation patterns.

### Protect — non-negotiable constraints
Record:
- Target product identity and brand rules.
- Required information hierarchy and primary user tasks.
- Existing routes, behavior, data, permissions, APIs, and workflows in redesign mode.
- Accessibility, readable contrast, keyboard access, and reduced-motion support.
- Performance, browser support, and responsive constraints.
- Asset licensing, trademarks, logos, and third-party intellectual property.

### Avoid — undesired outcomes
Record:
- Reference copied too literally where originality was requested.
- Generic template appearance that loses the reference's character.
- Trend effects added without a communication purpose.
- Inconsistent visual language or unrelated styles mixed together.
- Decorative treatment that weakens readability, usability, accessibility, or product identity.

If the user gives no explicit anchors, use a conservative default: preserve the reference's mood, broad color character, typography personality, density/rhythm, and shape language; reinterpret layout and component composition to suit the target product. State these assumptions in the brief so they can be corrected.

## 3. Generate an original design direction

Translate the brief into a coherent design concept:
- One-sentence creative concept.
- Preserved design anchors.
- Reinterpreted elements.
- Component and layout principles.
- Design tokens and semantic roles.
- Image/icon/illustration direction.
- Motion and effects principles.
- Responsive behavior.
- Accessibility and performance guardrails.

For a broad or system-wide redesign, present up to two or three materially different directions before large-scale implementation when user review is practical. Do not create unnecessary options for a small, well-specified change. Once a direction is selected, apply it consistently.

Do not treat a numeric similarity percentage as a reliable creative-quality metric. The brief defines intended resemblance qualitatively.

## 4. Implement without losing product fit

- Fit the new visual direction to the target product's content, tasks, audience, and information density.
- Preserve existing product behavior and contracts in redesign mode unless the user explicitly approves changes.
- Create original layouts and component variants rather than mechanically copying screenshot coordinates.
- Use the reference as a source of design principles, not as a requirement to duplicate every visible element.
- Create or adapt tokens systematically; avoid one-off styling and arbitrary effects.
- Use authorized assets. Do not copy proprietary assets, logos, or distinctive brand identifiers without permission.
- Keep the result coherent across routes and responsive breakpoints.

## 5. Evaluate creative success

Evaluate against the **creative direction brief**, not exact pixel equality.

The agent must visually inspect the reference and implementation and answer:

1. Are the selected design anchors still recognizable?
2. Is the implementation clearly an original interpretation rather than a literal copy?
3. Does the result fit the target product's content, audience, and primary tasks?
4. Is the design system coherent across pages and components?
5. Are hierarchy, readability, accessibility, and responsive behavior preserved or improved?
6. Do interactions, effects, and animation reinforce the intended personality without harming usability?
7. In redesign mode, do existing workflows and data/API contracts still work?

Use side-by-side screenshots and overlays as visual evidence. Pixel-diff metrics may reveal unintended regressions, but a large difference from the source is not automatically a defect in this mode. Do not optimize for minimum changed-pixel ratio.

## 6. Delivery report

Include:
- Work mode and fidelity mode.
- Creative direction brief: preserve, reinterpret, protect, avoid.
- Design choices that intentionally diverge from the reference and why.
- Screens/routes/components covered.
- Visual evidence that the retained anchors are recognizable.
- Functional, responsive, accessibility, motion, and performance test results.
- Existing-product regression evidence in redesign mode.
- Unresolved issues and assumptions.

## Stop conditions

Stop before implementation if visual perception is unavailable. Request user approval before changing protected product behavior or brand constraints. If a reference is too incomplete to establish the intended visual anchors, ask one focused clarification rather than inventing a style direction.


## 7. Mandatory anti-AI-slop review

Read `references/anti-ai-slop.md` before selecting visual treatments or implementing the creative direction.

Creative freedom is not permission to assemble a generic trend stack. The design must be specific to the actual product, audience, content, and user tasks.

Before implementation, add a one-sentence design thesis that identifies the product-specific visual point of view and one or two signature devices. Do not use a style label such as "premium SaaS", "futuristic", or "modern dashboard" as the entire thesis.

Treat gradients, glassmorphism, glow, blur, neon, rounded cards, pill controls, oversized hero typography, abstract 3D shapes, and scroll effects as optional techniques—not defaults. Use them only when they support the reference, product identity, hierarchy, or interaction. Do not ban them categorically; justify them.

Avoid interchangeable templates, repetitive card grids, decorative badges, generic stock imagery, emoji icons, filler copy, and fabricated metrics/testimonials/logos. Use genuine or clearly labeled illustrative content and authorized assets.

Before delivery, complete the de-slop review in `anti-ai-slop.md`. If the design could be transplanted unchanged into unrelated products, relies on trend stacking, or contains major elements with no product/user rationale, revise it.
