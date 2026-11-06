# Agent Installation and Runtime Requirements

This repository follows the vendor-neutral Agent Skills convention. The Vercel Skills CLI installs the Skill into the selected agent's discovery directory.

## Install

Interactive installation:

```bash
npx skills add tgkjuanda/reference-driven-ui-engineering
```

Selected agent example:

```bash
npx skills add tgkjuanda/reference-driven-ui-engineering \
  --skill ui-reference-replication \
  --agent antigravity \
  --agent claude-code \
  --agent opencode \
  --yes
```

Use the CLI's interactive selector for the agent identifiers currently supported by the installer. Installation destinations can change between agent versions.

## Antigravity routing rule

The repository includes `.agents/rules/ui-reference-replication.md` to route matching reference-led UI implementation requests to the Skill by default.

Install the rule in the target workspace:

```bash
mkdir -p /path/to/your-app/.agents/rules
cp .agents/rules/ui-reference-replication.md /path/to/your-app/.agents/rules/
```

The routing rule is separate from Skill installation.

## Runtime requirements

Installation only copies instructions and helper scripts. It does not grant browser control, terminal access, project write permissions, credentials, Figma access, or image perception.

The agent must directly inspect both the source reference and its rendered implementation. If it cannot inspect both, it must stop before modifying the target project. Visual capability is a runtime property, not something guaranteed by a successful installation.
