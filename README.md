# UI Reference Replication — OpenCode Skill

An OpenCode Agent Skill for reconstructing high-fidelity, responsive web interfaces from Figma links, live website URLs, screenshots, and image references.

## What it does

- Inspects the source design and current project before implementation.
- Reverse-engineers layout geometry, typography, color, spacing, components, and assets.
- Preserves the existing frontend stack and conventions.
- Implements visible interactions and responsive adaptations.
- Uses browser screenshots and iterative visual comparison when tools are available.
- Clearly distinguishes verified facts, estimates, and access limitations.

## Install in one project

Clone this repository, then copy the included skill directory:

```bash
git clone https://github.com/tgkjuanda/ui-reference-replication.git
```

Copy:

```text
ui-reference-replication/.opencode/skills/ui-reference-replication/
```

into your target project's:

```text
your-project/.opencode/skills/ui-reference-replication/
```

The installed directory should contain:

```text
.opencode/skills/ui-reference-replication/
├── SKILL.md
└── references/
    └── evidence-and-visual-qa.md
```

## Install globally

Copy `.opencode/skills/ui-reference-replication/` to:

- macOS/Linux: `~/.config/opencode/skills/ui-reference-replication/`
- Windows: `%USERPROFILE%\.config\opencode\skills\ui-reference-replication\`

## Invoke in OpenCode

```text
@ui-reference-replication Recreate this reference as closely as possible:
https://www.figma.com/community/file/1381931496411280342/schoolhub-school-management-admin-dashboard-template

Inspect the reference and this repository first. Preserve the current stack.
Do not invent inaccessible frames or assets. Implement and visually verify.
```

You can also attach screenshots/images directly and invoke `@ui-reference-replication`.

## Runtime capabilities

The skill defines the workflow; it does not itself grant browser, Figma API, screenshot, or image-diff capabilities. Those depend on tools/MCPs and dependencies available to the OpenCode runtime. The skill instructs the agent to detect available tools and disclose verification limits.

## License and source assets

The skill instructions in this repository are provided under the MIT License. This does not grant rights to third-party Figma templates, logos, images, fonts, or other assets. Confirm the source design's license and use authorized assets.
