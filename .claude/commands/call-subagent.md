---
description: Call a SubAgent from .subagents/ folder
allowed-tools: Bash, Read
---

# Call SubAgent

$ARGUMENTS

1. Read `.subagents/manifest.json` (or `~/.subagents/manifest.json` for global agents)
2. Find agent matching the task
3. Read the instructions from `instructionsPath` field
4. Execute `commands.start`
5. Handle follow-ups with `commands.resume`
