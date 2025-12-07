# SubAgent Manager

**VS Code Extension for managing AI Sub-Agents across CLI tools (Codex CLI, Claude Code CLI).**

![Version](https://img.shields.io/badge/version-0.0.20-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-1.85+-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

SubAgent Manager lets you create, organize, and deploy specialized AI assistants (Sub-Agents) that work within your existing AI CLI tools. Define an agent once, deploy it everywhere.

### Key Features

- **Visual Editor** — Create and edit SubAgents with a rich UI
- **Library** — Personal collection of reusable SubAgents  
- **Deploy** — One-click deploy to Project or Global scope
- **Multi-CLI** — Works with Codex CLI and Claude Code CLI as Main Orchestrator Agents. Creates SubAgents for either Codex CLI or Claude Code CLI. Requires user authorization in Codex CLI and Claude Code CLI.
- **Auto-Routing** — Automatic task delegation based on trigger keywords
- **Import/Export** — Share SubAgents between users via `.subagent` files

![Create SubAgent UI](docs/images/create-subagent-ui.png)

## Installation

Download the latest `.vsix` release from [Releases](https://github.com/OleynikAleksandr/multicli-subagents/releases) and install in VS Code:

1. In VS Code: `Extensions` → `...` → `Install from VSIX...`
2. Select the downloaded `.vsix` file

## Quick Start

1. **Open** SubAgent Manager from the Activity Bar (MsA icon)
2. **Create** a new SubAgent with name, description, triggers, and instructions
3. **Deploy** to Project (current workspace) or Global (all projects)
4. **Use** the SubAgent via slash command in Codex/Claude, or by mentioning trigger words to the Main Agent, or simply describe a task matching the SubAgent's description

### Example: Translator SubAgent

```yaml
Name: translator
Triggers: Translates text and/or files to the specified language + translate, перевод, übersetzen
Instructions: |
  You are a professional translator.
  Translate the given text to the requested language.
  Preserve formatting and technical terms.
  Save translations next to the original files with a language prefix.
```

After deploy, use in Codex CLI or Claude Code CLI:
```
/subagent-translator Translate this README to French
```

## Architecture

```
~/.subagents/           # Global SubAgents storage
├── manifest.json       # Registry of deployed agents
└── {agent}/            # Agent directory
    └── {agent}.md      # Agent instructions

~/.codex/prompts/       # Codex slash commands
└── subagent-{name}.md  # Individual agent command

~/.claude/commands/     # Claude slash commands  
└── subagent-{name}.md  # Individual agent command
```

## Documentation

- [Changelog](CHANGELOG.md)

## License

MIT
