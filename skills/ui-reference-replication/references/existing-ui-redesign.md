# Existing UI Redesign: Reference-Driven Restyling

## Purpose

Use this mode when an application or website already exists and the user wants its visual design redesigned to follow a supplied reference style, theme, or interface. This is not a greenfield rebuild.

The required outcome is:

- Preserve the application's existing capabilities, content model, routes, permissions, data flow, and user workflows unless the user explicitly approves a functional change.
- Transform the visual language and interaction presentation to match the supplied reference.
- Verify the redesigned implementation visually against the reference and functionally against the existing application baseline.

The mandatory visual-capability gate still applies. If the agent cannot directly inspect both the reference and the current/redesigned UI, reject the task before modifying the project.

## 1. Identify the redesign scope

Classify the request before editing:

- **Theme/style transfer:** apply colors, typography, spacing, radii, borders, shadows, surfaces, icon style, motion language, and component appearance while preserving current layout and behavior as much as possible.
- **Component redesign:** restyle selected components or page regions while retaining their contracts and behavior.
- **Page redesign:** restructure selected screens to follow the reference's hierarchy and layout while preserving their information and workflows.
- **System-wide redesign:** migrate the shared design system and all in-scope routes/components consistently.
- **Hybrid redesign:** combine the above only for explicitly identified routes or components.

Record which routes, page families, components, states, and viewport sizes are in scope. Do not assume that one screenshot authorizes a redesign of every route.

## 2. Establish the existing-product baseline

Before changing code, inspect the current application and create a baseline inventory.

### Product and behavior inventory

Record, where applicable:
- Routes, navigation destinations, deep links, and browser history behavior.
- User roles, permissions, authentication states, and protected actions.
- Forms, fields, validation rules, submission behavior, and error handling.
- Data tables, sorting, filtering, search, pagination, bulk actions, and exports.
- CRUD operations and API/service contracts.
- Loading, empty, success, disabled, error, and offline states.
- Keyboard interactions, focus order, accessible names, and shortcuts.
- Analytics events and business-critical user flows.
- Responsive behavior and supported browsers.
- Existing tests, build commands, type checks, lint rules, and known defects.

Capture a baseline of current routes and primary workflows. Record any behavior that cannot be tested because of missing credentials, unavailable backend services, or environment limitations.

### Technical inventory

Inspect the current framework, routing, component library, state management, styles, tokens, asset pipeline, and dependencies. Identify shared components and styling boundaries before deciding where to make changes.

Do not replace the application's framework, router, component library, or state architecture merely to achieve the visual redesign.

## 3. Analyze the visual reference

Use the mandatory visual-perception workflow to inspect the reference. Extract only the design language and structure supported by the supplied evidence:

- Color palette and semantic surface roles.
- Typography families, scale, weights, line-height, and text hierarchy.
- Spacing scale, container widths, grid, alignment, and responsive transitions.
- Radius, borders, shadows, elevation, blur, transparency, and other effects.
- Iconography, image treatment, component anatomy, and component variants.
- Interaction states and feedback styling.
- Motion purpose, trigger, timing, easing, and reduced-motion behavior when observable.

Separate **style rules** from **reference-specific product content and behavior**. The reference may define the look and feel without defining the target application's business logic.

When the target reference lacks information about a current application workflow, preserve the existing product behavior rather than copying or inventing behavior from the reference.

## 4. Map reference style to the existing application

Create a migration map before broad edits.

| Existing element | Existing behavior/contract | Reference style pattern | Planned change | Regression evidence |
|---|---|---|---|---|
| Shared button | Submit, navigate, disable, loading | Reference button/variants | Visual and state styling | Action and state tests |
| Navigation | Routes, permissions, active state | Reference navigation | Layout and appearance | Route/access tests |
| Form controls | Values, validation, errors | Reference fields | Visual treatment and focus/error states | Form tests |
| Data table | Sorting, pagination, selection | Reference table | Density, typography, surfaces | Table interaction tests |
| Dialog/drawer | Open/close, focus, confirmation | Reference overlay | Surface and transition | Focus and workflow tests |

Create a token mapping from the reference to the target design system. Prefer adapting existing semantic tokens and shared components over adding parallel CSS or duplicating components.

Record exceptions where a reference component cannot be applied without harming the target application's usability or information density.

## 5. Implement as a controlled migration

Use small, reversible changes in this order:

1. Capture baseline screenshots and run existing tests.
2. Define or update canonical design tokens and theme variables.
3. Restyle shared primitives: typography, surfaces, buttons, inputs, icons, spacing, and focus treatments.
4. Update shared layout components and navigation.
5. Migrate page families incrementally.
6. Add reference-backed motion and visual effects with reduced-motion alternatives.
7. Recheck responsive layouts and touch interactions.
8. Remove obsolete styles only after confirming no in-scope or out-of-scope component still depends on them.

Preserve component APIs and event/data contracts where possible. If a contract must change, document why, identify every consumer, and obtain user approval before changing externally visible behavior.

Do not:
- Delete, hide, or disable existing features merely because they are absent from the reference.
- Replace real data with sample/static content.
- Remove validation, permissions, loading/error handling, keyboard support, or analytics hooks.
- Change API payloads, database schemas, authentication, authorization, or business rules as part of a visual-only redesign.
- Apply broad global CSS overrides that cause untracked regressions.
- Copy proprietary logos, images, fonts, or assets without authorization.

## 6. Regression and visual verification

Run both forms of verification. Passing one does not compensate for failing the other.

### Existing-product regression

Re-run the baseline routes and critical workflows:
- Navigation and deep links.
- Authentication/authorization states.
- Form entry, validation, submit, and recovery.
- Search, filters, sorting, pagination, and table actions.
- Dialogs, drawers, menus, and destructive-action confirmation.
- Keyboard operation and focus behavior.
- Loading, empty, success, and error states.
- Responsive and touch behavior.
- Build, type, lint, unit, integration, and end-to-end tests available in the project.

Compare baseline test results with post-redesign results. Investigate newly failing tests and console/network errors before delivery.

### Visual fidelity

Inspect reference and redesigned screenshots at the same viewport, route, scroll position, and state. Review:
- Overall composition and hierarchy.
- Typography and text wrapping.
- Colors, spacing, dimensions, and surface treatments.
- Component styling and iconography.
- Responsive changes and clipping/overflow.
- Motion recordings or key frames when animation is in scope.

Use pixel diffs as diagnostics only. The agent must directly inspect both images and confirm that corrections improve alignment with the reference without breaking the existing application.

## 7. Delivery report

Report:
- Redesign mode and exact scope.
- Routes and components migrated.
- Design tokens/components reused or introduced.
- Existing features and contracts intentionally preserved.
- Any requested or approved functional changes.
- Baseline tests vs post-redesign tests.
- Reference and implementation screenshots visibly inspected.
- Responsive, accessibility, reduced-motion, and performance results.
- Regressions, unresolved deviations, and blocked checks.

## Stop conditions

Stop before implementation if the visual-capability gate fails. Stop and request approval before any unrequested change to business logic, data contracts, permissions, APIs, routes, or destructive functionality. A redesign is complete only when the visual reference checks and existing-product regression checks have both been reported honestly.
