---
trigger: always_on
description: Route reference-led web and app UI design or implementation requests to the ui-reference-replication Skill by default.
---

# Default UI reference workflow

When a user asks to create, build, implement, recreate, replicate, redesign, restyle, or materially modify a web/app interface and supplies or points to visual reference evidence, load and follow the installed ui-reference-replication Skill before analysis, planning, or code changes. Do this by default without requiring the user to mention the Skill.

Visual reference evidence includes screenshots, UI images, photos of screens, Figma files/frames/links, live website or design URLs, mockups, wireframes, prototypes, and visual design specifications. Also use the Skill for visual comparison or audit of an implementation against one of these references.

- Locate the installed Skill from the available Skill inventory or its installation directory; do not assume a fixed path.
- Treat the Skill's visual-capability gate as mandatory. If the current agent cannot inspect both the reference and the rendered implementation, stop before changing project files and report the missing capability.
- Keep this routing limited to web/app UI implementation and reference-based visual QA. Do not invoke it for backend-only work, unrelated code maintenance, content-only writing, or general design discussion without implementation or visual audit.
- Preserve the user's explicit scope. The routing rule selects the workflow; it does not authorize unrequested product or business-logic changes.
- If the Skill is not installed or discoverable, state that clearly. Do not imitate or claim to have run its checks without the Skill.
