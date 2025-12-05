#!/bin/bash
#
# codex-setup-subagents.sh
# Creates Sub-Agent infrastructure for Codex CLI
#
# Usage: ./codex-setup-subagents.sh
#

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Codex Sub-Agent Setup ===${NC}"
echo ""

# Paths
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
PROMPTS_DIR="${CODEX_HOME}/prompts"
WORKSPACE_ROOT="$(pwd)"
SUBAGENTS_DIR="${WORKSPACE_ROOT}/.codex/subagents"

# Step 1: Create global prompts directory
echo -e "${YELLOW}[1/3] Setting up global prompts directory...${NC}"
mkdir -p "${PROMPTS_DIR}"
echo "  ✓ ${PROMPTS_DIR}"

# Step 2: Create /prompts:subagent command (if not exists)
echo ""
echo -e "${YELLOW}[2/3] Creating /prompts:subagent slash-command...${NC}"

PROMPT_FILE="${PROMPTS_DIR}/subagent.md"
if [ -f "${PROMPT_FILE}" ]; then
    echo -e "  ${BLUE}ℹ Already exists: ${PROMPT_FILE}${NC}"
    echo "  Skipping (remove manually to recreate)"
else
    cat > "${PROMPT_FILE}" << 'PROMPT_EOF'
---
description: Run a Sub-Agent to execute a task in background
argument-hint: AGENT=<name> TASK=<description>
---

# Sub-Agent Launch Instructions

You are the Main Agent. The user wants to delegate a task to a Sub-Agent.

## Parameters
- **Agent Name:** $AGENT
- **Task Description:** $TASK

## Your Actions

### Step 1: Verify Sub-Agent exists
Check if the file `.codex/subagents/$AGENT/$AGENT.md` exists in current workspace.
If it does NOT exist, inform the user:
> Sub-Agent "$AGENT" not found. Create it first:
> `.codex/subagents/$AGENT/$AGENT.md`

### Step 2: Launch Sub-Agent
Execute this bash command:

```bash
codex exec \
  --skip-git-repo-check \
  --full-auto \
  --add-dir "$(pwd)" \
  -C "$(pwd)" \
  "First, read the file .codex/subagents/$AGENT/$AGENT.md for your instructions. Then execute the following task: $TASK"
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
- Sub-Agent reads ONLY its specific instructions from `$AGENT.md`
- `--full-auto` enables automatic command approval
- `--skip-git-repo-check` is for initial `codex exec` only, NOT for `resume`
- For `resume`: ensure workspace has git repo (run `git init` if needed)
- You handle all Sub-Agent questions autonomously
PROMPT_EOF
    echo -e "  ${GREEN}✓ Created: ${PROMPT_FILE}${NC}"
fi

# Step 3: Create local subagents directory with example
echo ""
echo -e "${YELLOW}[3/3] Creating local Sub-Agents directory...${NC}"
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
echo ""
echo "  GLOBAL: ${CODEX_HOME}/"
echo "  └── prompts/"
echo "      └── subagent.md      (slash-command)"
echo ""
echo "  LOCAL: ${WORKSPACE_ROOT}/"
echo "  └── .codex/"
echo "      └── subagents/"
echo "          └── example/"
echo "              └── example.md   (example agent)"
echo ""
echo -e "${RED}⚠ IMPORTANT: Restart Codex CLI for the command to appear!${NC}"
echo ""
echo -e "${BLUE}Usage:${NC}"
echo '  1. Start Codex CLI: codex'
echo '  2. Type / and look for "prompts:subagent"'
echo '  3. Use: /prompts:subagent AGENT=example TASK="Your task here"'
echo ""
echo "To create more Sub-Agents:"
echo '  mkdir -p .codex/subagents/<name>'
echo '  # Create .codex/subagents/<name>/<name>.md with instructions'
