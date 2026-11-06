---
trigger: always_on
description: Route reference-led web/app UI implementation and visual comparison to the ui-reference-replication Skill by default.
---

# Default UI reference workflow

When a user asks to create, build, implement, recreate, replicate, redesign, restyle, or visually compare a reference-led web/app UI implementation, and supplies or points to visual reference evidence, load and follow the installed ui-reference-replication Skill before analysis, planning, or code changes. Do this by default without requiring the user to mention the Skill.

Visual reference evidence includes screenshots, UI images, photos of screens, supplied Figma frame exports, public website pages, mockups, wireframes, prototypes, and visual specifications.

- Locate the installed Skill from the available Skill inventory or its installation directory; do not assume a fixed path.
- Follow the Community Edition's Reference-Faithful target. Treat the reference as the visual specification; do not invent a new visual direction or freely reinterpret it.
- Treat the visual-capability gate as mandatory. If the current agent cannot inspect both the reference and rendered implementation, stop before changing project files and report the missing capability.
- Preserve existing product behavior during visual redesigns unless the user explicitly requests a functional change.
- Keep this routing limited to web/app UI implementation and reference-based visual comparison. Do not invoke it for backend-only work, unrelated code maintenance, content-only writing, or general design discussion without implementation or visual audit.
- If the Skill is not installed or discoverable, state that clearly. Do not claim to have run its checks without the Skill.
