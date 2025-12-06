# multicli-agents

**Universal Sub-Agent System for AI CLI Tools (Codex, Claude, Gemini).**

![Extension Status](https://img.shields.io/badge/VS%20Code%20Extension-v0.0.1-blue)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Offline%20Passing-brightgreen)

## Overview

`multicli-agents` is a powerful system for managing LLM Sub-Agents that operate across different CLI environments. It allows you to:
1.  **Define Agents** once (as `.subagent` or JSON).
2.  **Use Agents** in multiple CLIs (Codex, Claude Code).
3.  **Manage Agents** via a user-friendly VS Code Extension.

## Features

- **Universal Sub-Agents**: Create agents compatible with multiple CLI tools.
- **Auto-Routing**: Automatically delegate tasks based on triggers (e.g., "translate", "refactor").
- **VS Code Extension (MVP)**:
  - **Visual Editor**: Create and edit agents with a rich UI.
  - **Local Library**: Manage your personal collection of agents.
  - **Deploy**: One-click deploy to your project (`.codex/subagents`) or globally.
  - **Import/Export**: Share agents easily via `.subagent` files.

## Installation

### VS Code Extension
Currently in Alpha (Local Install):
1.  Download the latest `.vsix` release or build it yourself (see below).
2.  In VS Code: `Extensions` -> `...` -> `Install from VSIX...`
3.  Select `multicli-agents-0.0.1.vsix`.

### CLI Infrastructure
To use the agents in your terminal:
```bash
# Setup infrastructure
./codex-setup-subagents.sh
```

## Usage

### 1. Managing Agents (VS Code)
1.  Open the **SubAgent Manager** view in the Activity Bar (Agent icon).
2.  **Create Agent**: Click `+ New Agent`. Fill in the name, description, triggers, and prompt instructions.
3.  **Edit**: Click on any agent in the "Library" or "Project" lists.
4.  **Deploy**: 
    - Click **Deploy to Project** to make the agent available in the current workspace.
    - Click **Deploy Globally** to make it available for all projects.

### 2. Using Agents (CLI)
Restart your CLI session (Codex/Claude) and use the routed commands.

**Codex Example:**
```bash
# Explicit call
/prompts:subagent AGENT=translator TASK="Translate README to Russian"

# Auto-routing (if triggers are matched)
Translate this file to French
```

## Development

### Prerequisites
- Node.js 18+
- VS Code 1.85+

### Build & Run
```bash
# Install dependencies
npm install

# Compile extension
npm run compile

# Run Unit Tests (Offline)
npm run test:offline

# Run Full Build & Check
./scripts/build-release.sh --use-current-version
```

## Architecture
See [Architecture Documentation](doc/Project_Docs/VSCode_Extension_Architecture.md) for details on the internal structure and design decisions.

## License
MIT
