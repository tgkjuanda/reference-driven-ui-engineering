# Responsive Layout, Interaction Feedback, and Error Recovery

## Responsive design

Use supplied Figma frames and screenshots as primary evidence. Build a viewport matrix with:
- Source-provided widths.
- Observed layout changes.
- Sidebar/navigation behavior.
- Grid/column transitions.
- Typography and spacing changes.
- Content visibility and scroll behavior.

When no responsive references exist, test representative implementation widths (for example 360px, 768px, and 1440px). Label them as inferred test widths, not reference frames.

Prefer fluid grid/flex layouts, min/max sizing, content-driven breakpoints, and accessible overflow patterns. Avoid fixed desktop coordinates as the default. Ensure key actions and content remain reachable without accidental horizontal overflow.

## Interaction feedback

Every meaningful user action must produce perceivable feedback. Define applicable:
- Default, hover, focus, pressed, selected, disabled.
- Pending/loading.
- Empty.
- Success.
- Validation error.
- Network/system error.

Every interactive state must remain clear without relying only on motion, color, or sound. Focus and selected states must be perceivable when animation is disabled.

## Error prevention and recovery

- Use clear labels and action descriptions.
- Validate inputs with actionable messages.
- Preserve entered data after recoverable errors.
- Disable actions only when the reason is clear and discoverable.
- Confirm destructive/irreversible actions.
- Offer retry or recovery steps for transient failures.
- Never announce success before the operation succeeds.
- Do not create decorative controls that appear functional but do nothing.

## Motion and effects

Use `references/motion-design.md` for the complete motion workflow. At minimum:
- Give each meaningful animation a communication or feedback purpose.
- Reuse motion duration, easing, distance, and stagger tokens.
- Match the reference; do not add parallax, looping motion, blur, glow, or 3D effects without evidence or approval.
- Test initial, active, completed, dismissed, and interrupted states.
- Honor `prefers-reduced-motion: reduce` and define a clear static or low-motion alternative.
- Check that visual effects do not obscure content, focus, controls, or text contrast.
- Profile expensive filters, large blur surfaces, and scroll-linked motion on representative devices.
- Check for layout shifts, accidental pointer interception, and controls moving away from the user's focus.
