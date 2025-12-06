---
description: Call a SubAgent from .subagents/ folder
argument-hint: NAME=<agent> TASK=<description>
---

# Call SubAgent

1. Read `.subagents/manifest.json`
2. Find agent by $NAME
3. Execute `commands.start` with $TASK
4. If agent asks questions, use `commands.resume`
