---
description: Call SubAgent "переводчик" - Переводит текст в указанных файлах с одного на другой указанные языки - языки нужно указать в Task
allowed-tools: Bash, Read
---

# SubAgent: переводчик

$ARGUMENTS

Execute this SubAgent with the task from arguments.

Start command:
```bash
cd "/Users/oleksandroliinyk/VSCODE/multicli-agents/.subagents/переводчик" && codex exec --skip-git-repo-check --full-auto "First, read переводчик.md. Then: $TASK"
```

Resume command (if questions are asked):
```bash
cd "/Users/oleksandroliinyk/VSCODE/multicli-agents/.subagents/переводчик" && codex exec resume $SESSION_ID "$ANSWER"
```

Replace $TASK with the actual task description.
Replace $SESSION_ID and $ANSWER when resuming.
