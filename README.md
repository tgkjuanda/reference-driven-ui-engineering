# UI Reference Replication

[![skills.sh](https://skills.sh/b/tgkjuanda/ui-reference-replication)](https://skills.sh/tgkjuanda/ui-reference-replication)

A cross-agent **Agent Skill** for recreating web UI from Figma files, website URLs, screenshots, and image references. It reverse-engineers layout and design tokens, implements the interface in the existing frontend stack, and requires visual QA instead of claiming fidelity without evidence.

## Install with skills.sh CLI

Requires Node.js **22.20 or later** for the current Vercel Skills CLI.

### Interactive install

Run this inside the target project:

```bash
npx skills add tgkjuanda/ui-reference-replication
```

The CLI downloads the repository skill, lets you choose the skill and detected AI agents, and installs it in their project-level skill directories.

### Install to Antigravity, Claude Code, and OpenCode together

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

### Install globally

Add `--global` (or `-g`) to either command to install for the selected agents at user scope:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --global \
  --yes
```

Project-scope installation is recommended when the same skill should be available to a team or workspace. For other agents supported by the CLI, use the interactive command and select them in the agent picker.

## Supported agent locations

| Agent | Project skill directory | Notes |
|---|---|---|
| Google Antigravity IDE | `.agents/skills/ui-reference-replication/` | Workspace skills; Antigravity also supports a global skills directory. |
| Google Antigravity CLI | `.agents/skills/ui-reference-replication/` | Workspace skill path. Global path differs from the IDE. |
| Claude Code | `.claude/skills/ui-reference-replication/` | Native project skill location. |
| OpenCode | `.opencode/skills/ui-reference-replication/` | Native project location; OpenCode also discovers shared `.agents/skills/` and Claude-compatible locations. |
| Codex and other agents | Agent-specific | Use the Skills CLI agent picker; it writes to the selected agent's supported path. |

The core skill content is vendor-neutral. The Skills CLI handles agent-specific placement; it does not translate or rewrite the instructions for each model.

## What the skill does

- Inspects the reference and existing repository before coding.
- Extracts layout geometry, typography, colors, spacing, components, and assets.
- Preserves the existing project framework and conventions.
- Implements visible interactions and responsive behavior.
- Captures and compares screenshots when browser tooling exists.
- Reports verified facts, estimates, deviations, and access limitations honestly.

## Manual installation

If you do not use the Skills CLI, copy:

```text
skills/ui-reference-replication/
```

to the target agent's skill directory shown above. The installed directory must contain `SKILL.md` and its `references/` folder.

## Update or remove

```bash
npx skills check
npx skills update ui-reference-replication
npx skills remove ui-reference-replication
```

Use the same scope flags (for example `-g`) when managing a global installation.

## Runtime requirements and limitations

The skill contains the workflow; it does **not** itself grant browser automation, Figma API access, screenshot capture, terminal permissions, credentials, or image-diff tools. These depend on the host agent and installed tools. The skill checks availability and discloses when visual verification is blocked.

Figma URLs may expose only a public preview. Do not invent hidden frames or assets; request authorized exports or screenshots when required.

## License and source assets

The instructions in this repository are licensed under MIT. This does not grant rights to third-party Figma templates, logos, images, fonts, or other assets. Confirm the source design's license before redistributing those assets.
