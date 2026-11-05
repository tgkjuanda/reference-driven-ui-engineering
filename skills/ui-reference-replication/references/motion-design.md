# Motion Design, Effects, and Animation Engineering

Motion is part of the interface, not decoration added after implementation. Reconstruct the motion that is supported by the reference, preserve its intent, and verify that it remains usable, accessible, and performant.

## 1. Motion principles

Apply these principles in order:

1. **Purpose before spectacle.** Motion must communicate state, causality, hierarchy, continuity, or meaningful feedback. Remove movement that adds no information.
2. **Reference before invention.** Inspect the actual trigger, direction, distance, duration, easing, delay, sequence, and exit behavior. Label every inferred value and do not invent elaborate motion when the reference is unavailable.
3. **Consistent physics.** Related components should share timing and easing tokens. A modal, drawer, tooltip, and menu may need different motion, but should feel as if they belong to one system.
4. **User control.** Respect reduced-motion preferences and provide pause/stop controls for applicable automatically moving content.
5. **Performance as a design constraint.** Effects must not create persistent jank, excessive repainting, scroll lag, or unnecessary battery use.
6. **Progressive enhancement.** The interface must remain understandable and operable if animation, blur, 3D, or other advanced effects are unavailable.

## 2. Classify what is being reconstructed

Keep static effects distinct from motion behavior.

### Motion patterns

- **Micro-interactions:** hover, focus, pressed, selected, toggled, validation, loading, success, and error feedback.
- **Component transitions:** menus, tooltips, accordions, tabs, dialogs, drawers, toasts, and expanding/collapsing regions.
- **Navigation transitions:** route changes, shared-element continuity, page entry/exit, and view transitions.
- **Scroll-linked motion:** sticky behavior, reveal, parallax, progress indicators, and scroll-triggered sequences.
- **Ambient motion:** looping backgrounds, shimmer, floating elements, particles, and decorative movement.
- **Advanced motion:** SVG timelines, Lottie, canvas, WebGL/3D, and interactive product demonstrations.

### Visual effects

- Gradients, mesh gradients, noise, texture, shadows, glow, borders, masks, clipping, blend modes, and filters.
- Transparency, glass-like surfaces, blur, and backdrop blur.
- SVG illustration, 3D surfaces, particles, and image treatments.

Do not combine effects merely because each is individually fashionable. Match the reference's visual language and retain a clear hierarchy.

## 3. Build a motion inventory

For each meaningful animated element, record:

| Field | What to inspect |
|---|---|
| Element/component | Which component or region moves? |
| Purpose | What information or feedback does the motion communicate? |
| Trigger | Load, hover, focus, click, state change, route change, or scroll? |
| Properties | Transform, opacity, color, filter, clip-path, layout, or other property? |
| Direction and distance | From/to position, scale, rotation, and origin |
| Timing | Duration, delay, sequence, and repeat/loop behavior |
| Easing | Curve or spring behavior, including overshoot where visible |
| Interruption | Can it be reversed, interrupted, dismissed, or replayed? |
| Responsive behavior | Does it change or disappear at a viewport breakpoint? |
| Reduced motion | What is removed or substituted when motion is reduced? |
| Evidence | Reference URL/frame, capture, measurement, or documented inference |

Inspect the initial, in-progress, completed, and dismissed states. For scroll-driven animation, record the scroll range and the relationship between scroll position and progress. Distinguish observed source behavior from assumptions.

## 4. Create motion tokens

Use the project's existing token architecture. Keep primitive values separate from semantic motion roles.

Token families should cover, where used:

- Duration: instant/feedback, standard/component, and deliberate/emphasis.
- Easing: standard, enter, exit, and expressive/spring behavior.
- Distance: subtle, standard, and large movement.
- Stagger: sequence spacing for related items.
- Delay: only where it communicates sequence or avoids competing motion.
- Effect strength: blur, shadow, glow, and opacity levels when these are repeated design decisions.

Prefer semantic names such as `motion.duration.standard` or `motion.easing.enter` rather than component-specific one-off values. Use DTCG-compatible types only where the actual token value matches the specification. Do not claim full DTCG conformance from naming alone.

If the source reference is available, derive values from its observed behavior. If it is not, use a small documented scale and tune it through browser testing. Illustrative starting ranges—not universal rules—are roughly 100–180 ms for direct feedback, 160–300 ms for common component transitions, and 300–600 ms for larger spatial or narrative transitions. Distance, easing, device performance, and user expectations matter as much as duration.

Avoid arbitrary per-component durations and excessive staggering. The user should not have to wait for decorative choreography before reaching the content or primary action.

## 5. Implementation and performance

- Prefer native CSS transitions/animations or existing project motion infrastructure when they satisfy the requirement. Add a motion library only when it materially simplifies complex sequencing, gestures, or shared-layout behavior.
- Prefer `transform` and `opacity` for frequent animation when they reproduce the intended effect. These properties are often easier for browsers to composite efficiently.
- Avoid repeatedly animating layout-affecting properties such as `top`, `left`, `width`, and `height` when a transform-based solution can preserve the same visual result.
- Treat large-area blur, backdrop filters, animated shadows, complex filters, masks, and many simultaneous layers as potentially expensive. Profile on representative devices and browsers rather than assuming they are free.
- Use `will-change` sparingly and only after profiling demonstrates a need. Remove it when the animation is no longer active.
- Avoid unnecessary infinite loops, high-frequency DOM updates, scroll handlers that block rendering, and animations that continue when off-screen or irrelevant.
- Do not use animation to conceal loading delays, layout shifts, missing content, or broken state transitions.
- Provide a graceful static or simpler fallback for unsupported or costly visual effects.
- Keep text readable during motion. Avoid moving content under a pointer/focus target or shifting layout in a way that causes accidental activation.

The browser rendering pipeline matters more than whether animation is implemented in CSS or JavaScript. Inspect real rendering and performance traces when a motion issue is suspected.

## 6. Accessibility and motion sensitivity

The minimum project target remains WCAG 2.2 AA for applicable criteria. In addition, use a stronger product policy for non-essential interaction-triggered motion:

- Honor `prefers-reduced-motion: reduce` in CSS and, where needed, in JavaScript.
- Remove or replace non-essential large translations, scaling, parallax, zooming, and spatial page transitions with a calm alternative such as an immediate state change or subtle opacity change.
- Do not remove essential information or functionality when motion is reduced.
- Keep focus visible and stable. Motion must not move keyboard focus unexpectedly or trap users in an animation.
- Automatically moving, blinking, scrolling, or updating content may require a pause, stop, or hide mechanism under WCAG 2.2 SC 2.2.2, depending on its duration and presentation.
- Avoid content that flashes more than three times in one second; assess applicable WCAG 2.2 SC 2.3.1 requirements.
- WCAG 2.2 SC 2.3.3 Animation from Interactions is Level AAA, not AA. Treat reduced-motion support for non-essential interaction motion as an explicit quality policy; do not mislabel it as an AA conformance requirement.
- For products with a motion setting, make the control discoverable and apply it consistently across routes and components.

Example CSS fallback:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Add component-specific overrides when a static state is clearer. */
}
```

The example is a defensive baseline, not a substitute for designing an appropriate reduced-motion state. Avoid blindly applying global overrides when a component needs a meaningful static alternative.

## 7. Motion QA protocol

Test motion as behavior, not just as a screenshot.

1. Capture the stable initial and final states at the same route, viewport, data, and color scheme as the reference.
2. Record or inspect key transitions, including entry, exit, reversal, interruption, and repeated activation.
3. Verify mouse, touch, keyboard, and focus behavior for interactive components.
4. Test with the browser's reduced-motion preference enabled. In Playwright, use `page.emulateMedia({ reducedMotion: "reduce" })` where supported, then verify the resulting behavior rather than merely checking that a CSS rule exists.
5. Check automatically moving content for required pause/stop/hide behavior.
6. Inspect console errors, failed assets, layout shifts, clipped layers, stacking-context problems, and accidental pointer interception.
7. Profile expensive effects and scroll-linked sequences on representative low/mid-range devices and target browsers.
8. Re-test responsive breakpoints; do not assume a desktop animation remains appropriate on a narrow or touch viewport.
9. Keep a motion defect log: element, expected behavior, actual behavior, evidence, severity, correction, and retest result.

A static screenshot cannot prove that an animation is correct. A successful reduced-motion CSS check cannot prove that all interactive motion is accessible. Report the exact states, devices, preferences, and browsers tested.

## 8. Delivery evidence

Include these items in the delivery report when motion is in scope:

- Motion inventory and source/inference labels.
- Motion token map and exceptions.
- Key state captures or recordings.
- Normal-motion and reduced-motion test results.
- Automatic-motion pause/stop review where applicable.
- Performance observations and expensive effects found.
- Unsupported effects, fallbacks, and unresolved deviations.

Never claim an animation is "smooth", "pixel-perfect", accessible, or fully tested without observed evidence.
