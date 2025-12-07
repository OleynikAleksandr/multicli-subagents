---
description: SubAgent Auto - reads manifest and picks the best SubAgent for your task
allowed-tools: Bash, Read
---

# SubAgent Auto

$ARGUMENTS

Read `.subagents/manifest.json` (or `~/.subagents/manifest.json` for global agents).
Analyze available SubAgents and their descriptions.
Pick the best one for the task.
Execute using the agent's `commands.start`.
Handle follow-ups with `commands.resume`.
