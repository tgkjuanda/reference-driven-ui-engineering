# Agent compatibility and installation paths

This repository uses the vendor-neutral Agent Skills folder convention: each skill is a directory with a `SKILL.md` and optional references/scripts. The Vercel Skills CLI maps it to the selected agent's discovery path.

## Selected agent installation targets

| Agent | CLI identifier | Project directory | Global directory |
|---|---|---|---|
| Antigravity IDE | `antigravity` | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
| Antigravity CLI | `antigravity-cli` | `.agents/skills/` | `~/.gemini/antigravity-cli/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `opencode` | `.opencode/skills/` | `~/.config/opencode/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.agents/skills/` |

The Skills CLI supports additional agents. Check its live agent list because support and installation paths can change.

**Important:** platform compatibility is not visual-capability certification. Whether the Skill can run depends on the model and runtime actually selected. The current agent must be able to visually inspect both the source reference and its own rendered screenshots/recordings. If not, the Skill must reject the task even when installation succeeds.

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

Installation only copies the Skill files. It does not automatically configure or authorize Figma MCP, browser automation, Playwright, axe-core, project terminal permissions, external credentials, or visual perception. Those are runtime/model capabilities and must be configured separately. This Skill requires direct visual perception to proceed.


## Evidence-backed compatibility matrix

The CLI agent selector identifies installation destinations; it does not certify the model or runtime. Keep the tested matrix separate from the installation table above.

Start from `skills/ui-reference-replication/templates/agent-compatibility.example.json`. Leave the `agents` array empty until an actual test is performed. For each tested agent/runtime/model, record the Skill version, test timestamp, installation evidence, and separate results for:

| Capability | What must be demonstrated |
|---|---|
| Visual input | Inspect a supplied reference image and a rendered implementation screenshot. |
| Browser | Open target routes, capture screenshots, and inspect browser states. |
| Terminal | Run project commands and report exit status. |
| File write | Create or edit a controlled test file in the target workspace. |
| Figma MCP | Read an authorized frame/variable/component when this integration is in scope. |
| Motion review | Inspect an actual animation recording or sampled frames when motion is in scope. |

Validate the actual test records:

```bash
npm run compatibility:validate -- --file artifacts/ui-reference/agent-compatibility.json --root .
```

An agent is marked compatible only when installation plus visual input, browser, terminal, and file-write checks pass. Untested Figma MCP or motion capabilities remain explicitly Not Tested and do not invalidate the core compatibility result. A successful Skills CLI installation alone is only partial compatibility.

The validator checks declared outcomes and that evidence files exist within the project root. It does not independently prove that a model perceived an image or that a capability remains stable across model/runtime upgrades. Record agent/model/runtime versions and repeat tests after meaningful upgrades.
