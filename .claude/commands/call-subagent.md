---
description: Call a SubAgent from .subagents/ folder
allowed-tools: Bash, Read
---

# Call SubAgent

$ARGUMENTS

1. Read `.subagents/manifest.json`
2. Find agent matching the task
3. Execute `commands.start`
4. Handle follow-ups with `commands.resume`
