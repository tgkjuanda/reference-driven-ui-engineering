# Accessibility Engineering

Target WCAG 2.2 Level AA for applicable criteria. This is an implementation target, not a certification or conformance claim.

## Required review

- Correct semantic landmarks, page title, and heading hierarchy.
- Accessible names for all controls and meaningful alternative text for informative images.
- Keyboard access for all interactive features; logical focus sequence; visible focus; no keyboard traps.
- Labels, instructions, required state, and programmatically associated validation errors.
- Sufficient text and non-text contrast for applicable states.
- No information conveyed by color alone.
- Dialog focus entry, containment where appropriate, Escape behavior when appropriate, and focus return.
- Status announcements for asynchronous updates and errors.
- Pointer target size/spacing and alternatives to complex pointer gestures.
- Reflow and zoom without loss of information or functionality.
- Reduced-motion behavior when animations are non-essential.

## Testing

Run an automated scanner such as axe-core when available, but do not treat automated results as a complete accessibility audit. Manually test primary flows with keyboard and inspect focus, names, labels, dialogs, and state announcements.

Report:
- Violations, severity, affected nodes, and rule IDs.
- Manual checks performed.
- Criteria not tested.
- Intentional deviations from the visual source and rationale.
