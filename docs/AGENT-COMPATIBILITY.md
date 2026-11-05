# Agent compatibility

The repository uses the open Agent Skills convention: a skill is a folder containing `SKILL.md` with YAML frontmatter and optional supporting files.

## Verified filesystem conventions

| Agent | Workspace/project location | Global location |
|---|---|---|
| Antigravity IDE | `.agents/skills/<skill>/` | `~/.gemini/config/skills/<skill>/` |
| Antigravity CLI | `.agents/skills/<skill>/` | `~/.gemini/antigravity-cli/skills/<skill>/` |
| Claude Code | `.claude/skills/<skill>/` | `~/.claude/skills/<skill>/` |
| OpenCode | `.opencode/skills/<skill>/` | `~/.config/opencode/skills/<skill>/` |
| Shared Agent Skills | `.agents/skills/<skill>/` | `~/.agents/skills/<skill>/` |

OpenCode also discovers the shared `.agents/skills/` and Claude-compatible skill directories. Antigravity IDE recognizes `.agents/skills/` for workspace scope. The Vercel Skills CLI maps a selected agent to its own install destination.

## Install

Recommended interactive flow:

```bash
npx skills add tgkjuanda/ui-reference-replication
```

Explicit multi-agent project installation:

```bash
npx skills add tgkjuanda/ui-reference-replication \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

The CLI also supports many other agents. Use its interactive agent picker for the current supported list instead of assuming every tool that reads Markdown has identical skill discovery behavior.

## Scope note

Project scope is the best common denominator for sharing with Antigravity IDE, Claude Code, and OpenCode. Global directories are product-specific and should be managed by the CLI or the respective agent's official instructions.
