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
