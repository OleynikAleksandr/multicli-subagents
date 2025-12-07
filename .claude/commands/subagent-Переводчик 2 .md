---
description: Call SubAgent "Переводчик 2 " - Переводчик 2 - Переводит текст в указанных файлах с одного на другой указанные языки - языки нужно указать в Task
allowed-tools: Bash, Read
---

# SubAgent: Переводчик 2 

$ARGUMENTS

Execute this SubAgent with the task from arguments.

Start command:
```bash
cd "/Users/oleksandroliinyk/VSCODE/multicli-agents/.subagents/Переводчик 2 " && codex exec --skip-git-repo-check --full-auto "First, read Переводчик 2 .md. Then: $TASK"
```

Resume command (if questions are asked):
```bash
cd "/Users/oleksandroliinyk/VSCODE/multicli-agents/.subagents/Переводчик 2 " && codex exec resume $SESSION_ID "$ANSWER"
```

Replace $TASK with the actual task description.
Replace $SESSION_ID and $ANSWER when resuming.
