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

## Error prevention and recovery

- Use clear labels and action descriptions.
- Validate inputs with actionable messages.
- Preserve entered data after recoverable errors.
- Disable actions only when the reason is clear and discoverable.
- Confirm destructive/irreversible actions.
- Offer retry or recovery steps for transient failures.
- Never announce success before the operation succeeds.
- Do not create decorative controls that appear functional but do nothing.
