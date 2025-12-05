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
