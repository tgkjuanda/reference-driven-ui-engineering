# Anti-AI-Slop and Design Originality Gate

## Purpose

Prevent generic, trend-driven, interchangeable interface output. A creative design must have a point of view grounded in the actual product, audience, content, brand, and reference—not a pile of fashionable UI effects.

"AI slop" in this Skill means a design that looks assembled from repeated generic patterns without a product-specific rationale. It is not a synonym for minimalism, maximalism, gradients, cards, glassmorphism, dark UI, rounded corners, or any single visual style. Any visual technique may be appropriate when the brief, reference, product, and execution justify it.

## 1. Start from product reality, not a trendy style label

Before choosing visual treatments, identify:
- What the product does and its primary user task.
- Who uses it, in what context, and on what device.
- What information needs priority and what can remain secondary.
- What makes the product or brand distinct.
- Its content density, workflow complexity, and trust requirements.
- Existing brand rules and product behavior that must remain intact.

Do not treat terms such as "modern", "premium", "SaaS", "futuristic", "minimal", or "creative" as a complete design direction. Translate them into concrete decisions for hierarchy, typography, spacing, color, imagery, interaction, and motion.

## 2. Define a specific visual point of view

Write a short design thesis that explains:
- The intended personality and audience perception.
- The strongest visual idea or signature treatment.
- How the composition supports the product's primary task.
- Which reference qualities are retained and which are deliberately reinterpreted.

Choose one or two distinctive visual devices that reinforce the thesis. Do not combine every available trend into one screen. A coherent, restrained system is usually more convincing than multiple unrelated effects.

Avoid using a familiar style label as a substitute for a point of view. "Glassmorphism dashboard" is not a complete concept; explain why translucent surfaces help this product, what information they group, and how contrast and depth remain usable.

## 3. Anti-patterns to reject unless specifically justified

These are warning signs, not absolute bans. Keep them only when they serve a clear product, reference, brand, or usability purpose.

### Generic composition
- The same centered hero, giant headline, floating mockup, three feature cards, and CTA repeated across unrelated products.
- Every section or data group placed inside an identical rounded card.
- Repeated three-column grids when the content has different priorities or relationships.
- Symmetrical layouts chosen for convenience rather than information hierarchy.
- Excessive whitespace that pushes useful content below the fold, or dense layouts that ignore task priority.

### Trend stacking
- Purple/blue gradients, aurora backgrounds, glowing orbs, neon borders, glass panels, blur, particles, and 3D objects added together without a coherent reason.
- Glassmorphism, neumorphism, brutalism, editorial layouts, and other style systems mixed without a consistent visual grammar.
- A gradient, glow, shadow, texture, or blur applied to every component.
- Parallax, scroll reveal, stagger, and hover motion added merely to make the page feel "alive".

### Generic visual identity
- The same dark background, electric accent, oversized typography, and pill controls regardless of product domain.
- Default font choices used without considering brand personality, language support, readability, and licensing.
- Generic icon families or emoji substituted for meaningful product-specific iconography.
- Stock photos, abstract blobs, random 3D shapes, or decorative illustrations used to fill empty space.
- Placeholder charts, fake metrics, invented testimonials, fake customer logos, or fictional trust claims presented as real.

### Generic content and controls
- Placeholder copy, repeated slogans, vague feature descriptions, or meaningless labels.
- Badges, chips, pills, and tags used for decoration instead of conveying status or categorization.
- Buttons that look interactive but do nothing, or identical visual emphasis applied to primary and secondary actions.
- The same generic dashboard cards, pricing cards, testimonial cards, and FAQ modules added regardless of user need.

## 4. Build a deliberate visual system

### Composition and hierarchy
- Derive layout from content relationships and primary tasks.
- Vary section structure when the content calls for it: editorial split, asymmetric composition, focused work area, full-width data region, compact utility panel, or other meaningful patterns.
- Use card containers only when grouping, separation, or independent interaction benefits from them.
- Establish clear primary, secondary, and tertiary emphasis through scale, position, contrast, and spacing.
- Make the first viewport communicate what the product is and what the user can do.

### Typography
- Define roles for display, heading, body, data, caption, and control text.
- Choose typefaces and pairings for product character, readability, language coverage, performance, and licensing—not novelty alone.
- Use a controlled type scale, line lengths, line heights, and weights.
- Avoid oversized headings that consume space without improving hierarchy.
- Inspect real content wrapping; do not design only around short placeholder strings.

### Color and surfaces
- Create a coherent palette with semantic roles for background, surface, text, border, action, focus, and status.
- Use accent colors selectively so important actions and states remain distinct.
- Do not default to a purple/blue gradient, dark mode, or neon accent when the product/reference does not support it.
- Effects must not compromise contrast, text clarity, focus visibility, or perceived hierarchy.

### Assets and iconography
- Prefer assets that explain the product, demonstrate its actual use, or carry meaningful brand character.
- Use original, licensed, or user-provided assets. Do not fabricate customer logos, testimonials, statistics, badges, awards, or product capabilities.
- Keep icon stroke, size, optical weight, and alignment consistent. Do not mix unrelated icon families.
- Decorative illustration must have a clear role; remove it when it adds no information or identity.

### Motion and interaction
- Motion must explain state, causality, continuity, hierarchy, or feedback.
- Reuse coherent timing and easing tokens.
- Do not add looping ambient motion, cursor followers, parallax, or stagger to every section by default.
- Respect reduced-motion preferences and test interaction states.

## 5. The de-slop review

Before calling a creative design complete, the agent must visually inspect the implementation and answer every question:

1. **Product specificity:** Could this exact UI be pasted into five unrelated products by changing only the logo and title? If yes, redesign its signature elements around the actual product.
2. **Composition:** Does the layout reflect the real information hierarchy and user task, or is it a default grid/card template?
3. **Purpose:** Can the agent explain the user or brand purpose of every major decorative effect and visual element?
4. **Restraint:** Are multiple trends competing? Remove effects that do not improve clarity, identity, or interaction.
5. **Typography:** Is there a deliberate typographic hierarchy, and does real content fit?
6. **Authenticity:** Are imagery, metrics, testimonials, charts, and logos genuine, authorized, or clearly identified as illustrative?
7. **Consistency:** Do all pages and components belong to one visual system without becoming monotonous?
8. **Product fit:** Does the result support the product's tasks, density, audience, and trust requirements?
9. **Accessibility:** Are contrast, focus, keyboard behavior, responsive behavior, and reduced motion preserved?
10. **Regression:** In existing UI redesign mode, do existing features, routes, data, permissions, and workflows still work?

If any critical question fails, revise before delivery. Do not hide a generic design behind a high screenshot-difference score or claim originality based on visual complexity.

## 6. Element-level rationale

For each major distinctive visual decision, maintain a concise rationale:

| Element | Decision | Product/reference reason | User benefit |
|---|---|---|---|
| Layout | e.g. asymmetric split | Primary workflow needs a focused work area | Faster task recognition |
| Typography | e.g. editorial display + neutral body | Brand personality with readable operational content | Clearer hierarchy |
| Color | e.g. restrained warm accent | Matches brand/reference and marks primary actions | Better action recognition |
| Effect | e.g. one translucent overlay | Separates a contextual layer | Clearer depth |
| Motion | e.g. short panel transition | Explains state change | Better continuity |

The table is not a demand to add all these treatments. If an effect is unnecessary, omit it.

## 7. Delivery evidence

The delivery report must include:
- The design thesis and product-specific signature.
- Intentional use of cards, gradients, glass/blur, shadows, badges, illustrations, and motion—or confirmation that unnecessary treatments were omitted.
- Any fake/demo data clearly identified as illustrative.
- The de-slop review result and any revisions made.
- Remaining design compromises and why they remain.

A design passes this gate when it is product-specific, coherent, intentional, authentic, accessible, and functionally appropriate—not merely fashionable or visually busy.
