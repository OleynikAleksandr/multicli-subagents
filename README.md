# multicli-agents

Universal Sub-Agent system for AI CLI tools (Codex, Claude, Gemini).

## Features

- **Universal Sub-Agents** — create agents that work across multiple CLI tools
- **Auto-Routing** — automatically delegate tasks based on triggers
- **Manifest-based** — configure routing via `manifest.json`
- **VS Code Extension** — UI for creating, managing and sharing agents (Phase 3)

## Quick Start

```bash
# Setup infrastructure
./codex-setup-subagents.sh

# Restart Codex CLI, then use:
/prompts:subagent AGENT=translator TASK="Translate README to Russian"
```

## Supported CLI Agents

| CLI | Status | Custom Commands |
|-----|--------|-----------------|
| Codex CLI | ✅ Tested | `~/.codex/prompts/*.md` |
| Claude CLI | 🔄 Planned | `~/.claude/commands/*.md` |
| Gemini CLI | 🔄 Planned | `~/.gemini/commands/*.toml` |

## Documentation

- [Architecture](doc/Project_Docs/SubAgent_System_Architecture.md)
- [CLI Research](doc/Knowledge/CLI_Agents_Research.md)

## License

MIT
