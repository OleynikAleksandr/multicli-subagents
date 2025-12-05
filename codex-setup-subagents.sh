#!/bin/bash
#
# codex-setup-subagents.sh
# Creates Sub-Agent infrastructure for Codex CLI in the current workspace
#
# Usage: ./codex-setup-subagents.sh
#

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Codex Sub-Agent Setup ===${NC}"
echo ""

# Get workspace root (current directory)
WORKSPACE_ROOT="$(pwd)"
CODEX_DIR="${WORKSPACE_ROOT}/.codex"
PROMPTS_DIR="${CODEX_DIR}/prompts"
SUBAGENTS_DIR="${CODEX_DIR}/subagents"

# Create directories
echo -e "${YELLOW}[1/3] Creating directories...${NC}"
mkdir -p "${PROMPTS_DIR}"
mkdir -p "${SUBAGENTS_DIR}"
echo "  ✓ ${PROMPTS_DIR}"
echo "  ✓ ${SUBAGENTS_DIR}"

# Create /subagent slash-command
echo ""
echo -e "${YELLOW}[2/3] Creating /subagent slash-command...${NC}"
cat > "${PROMPTS_DIR}/subagent.md" << 'PROMPT_EOF'
---
description: Run a Sub-Agent to execute a task in background
argument-hint: <agent-name> <task-description>
---

# Sub-Agent Launch Instructions

You are the Main Agent. The user wants to delegate a task to a Sub-Agent.

## Parameters
- **Agent Name:** $1
- **Task Description:** $ARGUMENTS (everything after agent name)

## Your Actions

### Step 1: Verify Sub-Agent exists
Check if the file `.codex/subagents/$1/$1.md` exists.
If it does NOT exist, inform the user:
> Sub-Agent "$1" not found. Create it first:
> `.codex/subagents/$1/$1.md`

### Step 2: Launch Sub-Agent
Execute this bash command (substitute $1 and $ARGUMENTS with actual values):

```bash
codex exec \
  --full-auto \
  --add-dir "$(pwd)" \
  -C "$(pwd)" \
  "First, read the file .codex/subagents/<AGENT_NAME>/<AGENT_NAME>.md for your instructions. Then execute the following task: <TASK_DESCRIPTION>"
```

### Step 3: Save Session ID
Extract `session_id` from the output — you will need it for continuation.

### Step 4: Autonomous Continuation (without user involvement)
Analyze the Sub-Agent output. If it contains questions or clarification requests:
- **Answer them yourself** using your context
- Continue the session:
```bash
codex exec resume <SESSION_ID> "<your answer to Sub-Agent questions>"
```
- Repeat until you get the final result

## Important Notes
- Sub-Agent has FULL access to workspace via `--add-dir`
- Sub-Agent reads ONLY its specific instructions from `<agent-name>.md`
- `--full-auto` enables automatic command approval
- You handle all Sub-Agent questions autonomously
PROMPT_EOF

echo "  ✓ ${PROMPTS_DIR}/subagent.md"

# Create example Sub-Agent
echo ""
echo -e "${YELLOW}[3/3] Creating example Sub-Agent...${NC}"
mkdir -p "${SUBAGENTS_DIR}/example"
cat > "${SUBAGENTS_DIR}/example/example.md" << 'EXAMPLE_EOF'
# Example Sub-Agent Instructions

You are an Example Sub-Agent for testing purposes.

## Your Capabilities
- Create simple files
- Read existing files
- Execute basic commands

## Behavior
1. Always confirm what task you received
2. Execute the task step by step
3. Report the result clearly

## Example Response Format
```
Task received: <description>
Actions taken:
  1. ...
  2. ...
Result: <outcome>
```
EXAMPLE_EOF

echo "  ✓ ${SUBAGENTS_DIR}/example/example.md"

# Done
echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Structure created:"
echo "  .codex/"
echo "  ├── prompts/"
echo "  │   └── subagent.md      (slash-command)"
echo "  └── subagents/"
echo "      └── example/"
echo "          └── example.md   (example agent)"
echo ""
echo -e "${BLUE}Usage:${NC}"
echo "  1. Start Codex CLI: codex"
echo "  2. Use command: /subagent example \"Your task here\""
echo ""
echo "To create more Sub-Agents:"
echo "  mkdir -p .codex/subagents/<name>"
echo "  # Create .codex/subagents/<name>/<name>.md with instructions"
