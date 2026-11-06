# Existing UI Redesign: Preserve the Product

## Purpose

Use this workflow when an application already exists and the user wants its visual presentation updated to follow a supplied reference. This is not a greenfield rebuild.

The visual reference determines the target appearance. The existing application remains the source of truth for product behavior unless the user explicitly approves a functional change.

## 1. Define the scope

Record:
- Routes and screens included in the redesign.
- Components and page regions that may change.
- The supplied reference and its viewport dimensions.
- Existing behavior that must remain unchanged.
- Any user-approved functional changes.

A screenshot of one page does not authorize redesigning every route.

## 2. Establish the current baseline

Before editing, inspect the current application and record, where applicable:
- Routes, navigation destinations, and deep links.
- Features, user roles, and permissions.
- Forms, validation, and submission behavior.
- Data tables, search, filters, sorting, pagination, and actions.
- API/data contracts and important workflows.
- Loading, empty, success, and error states.
- Keyboard behavior and focus order.
- Existing project tests, build commands, and known defects.

Capture representative screenshots of the existing application. Run the tests already configured in the project and record the result. Note what could not be verified because of missing credentials, services, or test coverage.

## 3. Analyze the visual reference

Inspect the source image or rendered page directly. Record observable:
- Layout, page regions, grid, alignment, and spacing.
- Information hierarchy and reading order.
- Typography, colors, borders, radii, and surfaces.
- Component appearance, icons, and authorized assets.
- Visible interaction states.
- Responsive changes shown in supplied viewport references.

Do not infer hidden pages, missing workflows, or behavior that the source does not show. When the reference is silent about an existing product feature, preserve the existing feature.

## 4. Map visual changes to the current application

Before broad edits, identify the existing components and styles responsible for each visible region. Prefer updating shared components and canonical tokens over creating parallel CSS or duplicate components.

| Existing area | Behavior to preserve | Visual change |
|---|---|---|
| Navigation | Destinations, active route, permissions | Layout, spacing, typography, colors |
| Buttons | Actions, loading, disabled state | Size, shape, color, focus style |
| Forms | Values, validation, submit behavior | Labels, field styling, errors |
| Data views | Sorting, filtering, pagination, actions | Density, typography, borders, surfaces |
| Dialogs | Open/close, confirmation, focus | Dimensions and visual presentation |

## 5. Implement incrementally

1. Preserve a screenshot and test baseline.
2. Update shared design tokens and theme values.
3. Restyle shared primitives and components.
4. Update the application shell and navigation.
5. Migrate the agreed screens in small steps.
6. Recheck narrow and wide viewports.
7. Remove obsolete styles only after confirming that no other route or component depends on them.

Do not:
- Delete, hide, or disable existing features because they are absent from the reference.
- Replace real data with static/demo content.
- Remove validation, permissions, loading/error handling, or keyboard support.
- Change API payloads, database schemas, authentication, authorization, or business rules during a visual-only redesign.
- Apply broad global CSS overrides that cause untracked regressions.
- Copy third-party assets without authorization.

## 6. Verify the result

### Product behavior

Revisit the baseline routes and important workflows. Run the same project tests and compare results with the baseline. Investigate new failures, console errors, broken assets, and navigation problems.

### Visual fidelity

Capture the redesigned application at the same viewport, route, scroll position, and state as the source reference. Inspect source and output side by side. Correct macro geometry and hierarchy first, then typography, color, component dimensions, spacing, and details.

Use pixel-difference output only as a diagnostic. The agent must directly inspect both images.

### Responsive and accessible behavior

Check representative widths, clipping/overflow, navigation, primary actions, keyboard operation, visible focus, labels, and readable contrast.

## 7. Delivery report

Report:
- Exact routes/screens and components changed.
- Existing behavior and contracts preserved.
- Any approved functional changes.
- Screenshots visually inspected and their viewports.
- Project tests run before and after.
- Responsive and basic accessibility checks performed.
- Regressions, deviations, blockers, and checks not performed.

A redesign is complete only when the visual comparison and product-behavior checks are both reported honestly.
