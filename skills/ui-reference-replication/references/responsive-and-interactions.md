# Responsive Layout and Interaction Feedback

## Responsive design

Use supplied screenshots and visual references as primary evidence. Build a small viewport matrix with:
- Supplied viewport widths.
- Observed layout changes.
- Sidebar/navigation behavior.
- Grid and column transitions.
- Typography and spacing changes.
- Content visibility and scroll behavior.

When no responsive references exist, inspect representative implementation widths such as 360px, 768px, and 1440px. Label these as inferred test widths, not source reference frames.

Prefer fluid grid/flex layouts, min/max sizing, content-driven breakpoints, and accessible overflow patterns. Avoid fixed desktop coordinates as the default. Ensure key actions and content remain reachable without accidental horizontal overflow.

## Interaction feedback

Every meaningful user action must produce perceivable feedback. Define applicable states:
- Default, hover, focus, pressed, selected, and disabled.
- Pending/loading.
- Empty.
- Success.
- Validation error.
- Network/system error.

Every interactive state must remain clear without relying only on color or sound. Focus and selected states must remain perceivable.

## Error prevention and recovery

- Use clear labels and action descriptions.
- Validate inputs with actionable messages.
- Preserve entered data after recoverable errors.
- Disable actions only when the reason is clear and discoverable.
- Confirm destructive or irreversible actions.
- Offer retry or recovery steps for transient failures.
- Never announce success before the operation succeeds.
- Do not create decorative controls that appear functional but do nothing.
