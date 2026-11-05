# Agent compatibility and installation paths

This repository uses the vendor-neutral Agent Skills folder convention: each skill is a directory with a `SKILL.md` and optional references/scripts. The Vercel Skills CLI maps it to the selected agent's discovery path.

## Selected agents

| Agent | CLI identifier | Project directory | Global directory |
|---|---|---|---|
| Antigravity IDE | `antigravity` | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
| Antigravity CLI | `antigravity-cli` | `.agents/skills/` | `~/.gemini/antigravity-cli/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `opencode` | `.opencode/skills/` | `~/.config/opencode/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.agents/skills/` |

The Skills CLI supports additional agents. Check its live agent list because support and installation paths can change.

## Install interactively

```bash
npx skills add tgkjuanda/ui-reference-replication
```

## Install to selected agents

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

## Install globally

Use `--global` or `-g` for the selected CLI-supported destinations:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --global \
  --yes
```

## Shared directory behavior

Some agents, including OpenCode, can discover shared `.agents/skills/` directories. However, use the Skills CLI agent selector rather than manually assuming that every agent shares identical discovery behavior.

## Important limitations

Installation only copies the Skill files. It does not automatically configure or authorize Figma MCP, browser automation, Playwright, axe-core, project terminal permissions, or external credentials. Those are runtime capabilities and must be configured separately.
