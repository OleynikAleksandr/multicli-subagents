#!/bin/bash
#
# codex-setup-subagents.sh
# Creates Sub-Agent infrastructure for Codex CLI with auto-routing
#
# Usage: ./codex-setup-subagents.sh
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Codex Sub-Agent Setup v2 ===${NC}"
echo ""

# Paths
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
PROMPTS_DIR="${CODEX_HOME}/prompts"
WORKSPACE_ROOT="$(pwd)"
SUBAGENTS_DIR="${WORKSPACE_ROOT}/.codex/subagents"

# Step 1: Global prompts directory
echo -e "${YELLOW}[1/5] Setting up global prompts directory...${NC}"
mkdir -p "${PROMPTS_DIR}"
echo "  ✓ ${PROMPTS_DIR}"

# Step 2: /prompts:subagent command
echo ""
echo -e "${YELLOW}[2/5] Creating /prompts:subagent slash-command...${NC}"

PROMPT_FILE="${PROMPTS_DIR}/subagent.md"
if [ -f "${PROMPT_FILE}" ]; then
    echo -e "  ${BLUE}ℹ Already exists, updating...${NC}"
fi

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
Check if `.codex/subagents/$AGENT/$AGENT.md` exists.
If NOT — inform user to create it first.

### Step 2: Launch Sub-Agent
```bash
codex exec \
  --skip-git-repo-check \
  --full-auto \
  --add-dir "$(pwd)" \
  -C "$(pwd)" \
  "First, read .codex/subagents/$AGENT/$AGENT.md for your instructions. Then execute: $TASK"
```

### Step 3: Save Session ID
Extract `session_id` from output for continuation.

### Step 4: Autonomous Continuation
If Sub-Agent asks questions — answer them yourself using your context:
```bash
codex exec resume <SESSION_ID> "<your answer>"
```
Note: `resume` needs git repo. Run `git init` first if needed.
PROMPT_EOF
echo -e "  ${GREEN}✓ ${PROMPT_FILE}${NC}"

# Step 3: Create manifest.json
echo ""
echo -e "${YELLOW}[3/5] Creating manifest.json for auto-routing...${NC}"
mkdir -p "${SUBAGENTS_DIR}"

cat > "${SUBAGENTS_DIR}/manifest.json" << 'MANIFEST_EOF'
{
  "version": "1.0",
  "description": "Sub-Agent manifest for automatic task routing",
  "agents": [
    {
      "name": "translator",
      "triggers": ["translate", "переведи", "перевод", "translation", "to english", "to russian", "на английский", "на русский"],
      "description": "Translates text, files, or documentation between languages"
    }
  ]
}
MANIFEST_EOF
echo "  ✓ ${SUBAGENTS_DIR}/manifest.json"

# Step 4: Create translator Sub-Agent
echo ""
echo -e "${YELLOW}[4/5] Creating translator Sub-Agent...${NC}"
mkdir -p "${SUBAGENTS_DIR}/translator"

cat > "${SUBAGENTS_DIR}/translator/translator.md" << 'TRANSLATOR_EOF'
# Translator Sub-Agent

You are a Translation Sub-Agent. Your sole purpose is to translate text between languages.

## Your Capabilities
- Translate files (README, docs, code comments)
- Translate text snippets
- Detect source language automatically
- Preserve formatting (markdown, code blocks)

## Behavior
1. Identify source and target languages
2. If not specified, ask for clarification
3. Translate preserving original structure
4. Save translated content appropriately

## Supported Languages
- English ↔ Russian
- English ↔ Ukrainian
- Other common language pairs

## Output Format
When translating a file, create a new file with suffix (e.g., README_ru.md).
Report: source file, target file, languages used.
TRANSLATOR_EOF
echo "  ✓ ${SUBAGENTS_DIR}/translator/translator.md"

# Step 5: Create AGENTS.md routing instructions
echo ""
echo -e "${YELLOW}[5/5] Creating AGENTS.md with auto-routing rules...${NC}"

AGENTS_MD="${WORKSPACE_ROOT}/AGENTS.md"
if [ -f "${AGENTS_MD}" ]; then
    echo -e "  ${BLUE}ℹ AGENTS.md exists. Adding routing section...${NC}"
    if ! grep -q "Sub-Agent Auto-Routing" "${AGENTS_MD}"; then
        cat >> "${AGENTS_MD}" << 'ROUTING_EOF'

---

## Sub-Agent Auto-Routing

Before starting any task, check `.codex/subagents/manifest.json`.

If the user's request matches any `triggers` from an agent in the manifest:
1. Automatically delegate to that Sub-Agent
2. Use this command:
```bash
codex exec \
  --skip-git-repo-check \
  --full-auto \
  --add-dir "$(pwd)" \
  -C "$(pwd)" \
  "First, read .codex/subagents/<AGENT_NAME>/<AGENT_NAME>.md. Then execute: <USER_REQUEST>"
```
3. Handle Sub-Agent questions autonomously via `codex exec resume`

**Do NOT ask user for confirmation** — just delegate and report results.
ROUTING_EOF
        echo "  ✓ Added routing section to ${AGENTS_MD}"
    else
        echo "  ℹ Routing section already exists"
    fi
else
    cat > "${AGENTS_MD}" << 'AGENTS_EOF'
# Project Agent Instructions

## Sub-Agent Auto-Routing

Before starting any task, check `.codex/subagents/manifest.json`.

If the user's request matches any `triggers` from an agent in the manifest:
1. Automatically delegate to that Sub-Agent
2. Use this command:
```bash
codex exec \
  --skip-git-repo-check \
  --full-auto \
  --add-dir "$(pwd)" \
  -C "$(pwd)" \
  "First, read .codex/subagents/<AGENT_NAME>/<AGENT_NAME>.md. Then execute: <USER_REQUEST>"
```
3. Handle Sub-Agent questions autonomously via `codex exec resume`

**Do NOT ask user for confirmation** — just delegate and report results.
AGENTS_EOF
    echo "  ✓ Created ${AGENTS_MD}"
fi

# Done
echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Structure created:"
echo ""
echo "  GLOBAL: ~/.codex/prompts/subagent.md"
echo ""
echo "  LOCAL:"
echo "  ├── AGENTS.md                    (auto-routing rules)"
echo "  └── .codex/subagents/"
echo "      ├── manifest.json            (routing triggers)"
echo "      └── translator/"
echo "          └── translator.md        (translation agent)"
echo ""
echo -e "${RED}⚠ IMPORTANT: Restart Codex CLI!${NC}"
echo ""
echo -e "${BLUE}Test auto-routing:${NC}"
echo '  Just ask: "Переведи README на русский"'
echo '  Agent should automatically use translator Sub-Agent'
echo ""
echo -e "${BLUE}Manual usage:${NC}"
echo '  /prompts:subagent AGENT=translator TASK="Translate README to Russian"'
