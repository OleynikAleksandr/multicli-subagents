# Phase 3: VS Code Extension — Sub-Agent Manager

## Описание проекта

VS Code Extension для создания, управления и sharing'а Sub-Agent'ов для разных CLI-агентов.

---

## Поддерживаемые Основные Агенты

### 1. Codex CLI (OpenAI)
- **Custom commands:** `~/.codex/prompts/*.md` (глобальные)
- **Project instructions:** `AGENTS.md`
- **Формат:** Markdown с YAML frontmatter
- **Статус:** ✅ Реализовано в Phase 1-2

### 2. Claude Code CLI (Anthropic)
- **Custom commands:** `~/.claude/commands/*.md` (глобальные), `.claude/commands/*.md` (проект)
- **Формат:** Markdown с frontmatter (name, description, parameters, argument-hint)
- **Статус:** 🔄 Нужна адаптация

### 3. Gemini CLI (Google)
- **Custom commands:** `~/.gemini/commands/*.toml` (глобальные), `.gemini/commands/*.toml` (проект)
- **Формат:** TOML с `prompt`, `description`, `{{args}}`
- **Фича:** `!{shell command}` — выполнение shell в промпте
- **Extensions:** Поддержка расширений через GitHub
- **Статус:** 🔄 Нужна адаптация

### 4. Kimi CLI (Moonshot AI)
- **Dual-mode:** Agent Mode + Shell Mode (Ctrl-X)
- **MCP/ACP:** Поддержка Model Context Protocol
- **Особенность:** 256K context window
- **Статус:** 🔬 Нужно исследование (нет явных custom commands)

---

## Архитектура VS Code Extension

```
subagent-manager/
├── src/
│   ├── extension.ts              # Entry point
│   ├── providers/
│   │   ├── codex.ts              # Codex CLI adapter
│   │   ├── claude.ts             # Claude CLI adapter
│   │   ├── gemini.ts             # Gemini CLI adapter
│   │   └── kimi.ts               # Kimi CLI adapter (research)
│   ├── library/
│   │   ├── storage.ts            # Библиотека Sub-Agent'ов
│   │   └── sharing.ts            # Export/Import/Publish
│   ├── ui/
│   │   ├── webview/              # React UI
│   │   └── treeview.ts           # Explorer панель
│   └── models/
│       └── subagent.ts           # SubAgent model
├── webview/                      # React app для UI
└── package.json
```

---

## Библиотека Sub-Agent'ов

### Структура хранения
```
~/.subagent-library/
├── library.json                  # Индекс всех агентов
├── agents/
│   ├── translator/
│   │   ├── metadata.json
│   │   └── instructions.md
│   ├── code-reviewer/
│   └── ...
└── exports/                      # Для sharing
```

### metadata.json
```json
{
  "id": "translator",
  "name": "Translator",
  "description": "Translates files between languages",
  "author": "Oleksandr",
  "version": "1.0.0",
  "triggers": ["translate", "переведи", "перевод"],
  "supportedAgents": ["codex", "claude", "gemini"],
  "createdAt": "2025-12-05",
  "tags": ["translation", "i18n"]
}
```

---

## UI Flow

### 1. Create Sub-Agent
```
[Select Main Agent] → [Enter Name] → [Enter Description] → 
[Edit Instructions in VS Code] → [Define Triggers] → [Save to Library]
```

### 2. Deploy Sub-Agent
```
[Browse Library] → [Select Agent] → [Choose Scope (Global/Project)] →
[Select Target CLI] → [Deploy]
```

### 3. Share Sub-Agent
```
[Select Agent] → [Export to .subagent file] → [Share via GitHub/Gist]
```

---

## Verification Plan

### Automated Tests
- Unit tests для каждого adapter (codex, claude, gemini)
- Integration tests: создание + deployment

### Manual Testing
1. Установить extension в VS Code
2. Создать Sub-Agent через UI
3. Проверить deployment в целевой CLI
4. Протестировать auto-routing
