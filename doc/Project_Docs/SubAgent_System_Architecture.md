# Sub-Agent System Architecture

Универсальная система Sub-Agent'ов для CLI-агентов с поддержкой Codex, Claude, Gemini.

---

## 1. Концепция

### Проблема
CLI-агенты (Codex, Claude, Gemini) не имеют встроенного механизма делегации задач в Sub-Agent'ы.

### Решение
- Скрипт `codex-setup-subagents.sh` — инфраструктура для Sub-Agent'ов
- Manifest-based auto-routing — автоматическая маршрутизация по триггерам
- VS Code Extension — UI для создания, управления и sharing'а Sub-Agent'ов

---

## 2. Поддерживаемые CLI-агенты

### Codex CLI (OpenAI) ✅ Проверено
- **Custom commands:** `~/.codex/prompts/*.md`
- **Exec:** `codex exec --full-auto -p "prompt"`
- **Resume:** `codex exec resume <SESSION_ID> "prompt"`
- **Context:** ~128K tokens

### Gemini CLI (Google) ✅ Перспективный
- **Custom commands:** `~/.gemini/commands/*.toml`
- **Exec:** `gemini -p "prompt"`
- **Resume:** `gemini --resume <UUID> -p "prompt"`
- **Context:** **1M tokens** — лучший для Оркестратора!
- **Фичи:** `!{shell}` в промптах, Extensions

### Claude Code CLI (Anthropic) 🔄
- **Custom commands:** `~/.claude/commands/*.md`
- **Context:** ~200K tokens
- **Статус:** Нужна проверка exec/resume

### Kimi CLI (Moonshot AI) 🔬
- **API:** OpenAI-совместимый (`https://api.moonshot.ai/v1`)
- **Context:** 256K tokens
- **Проблема:** Нет явных custom commands
- **Решение:** Использовать через Codex CLI как модель

---

## 3. Архитектура (Текущая — Phase 1-2)

```
~/.codex/prompts/
└── subagent.md                    ← Глобальная slash-команда

workspace/
├── AGENTS.md                      ← Правила auto-routing
└── .codex/subagents/
    ├── manifest.json              ← Триггеры для маршрутизации
    └── <agent-name>/
        └── <agent-name>.md        ← Инструкции Sub-Agent'а
```

### Ключевые правила
- Slash-команды Codex CLI — **ГЛОБАЛЬНО** в `~/.codex/prompts/`
- Файл инструкций Sub-Agent'а — **НЕ `AGENTS.md`** (конфликт с Codex)
- `--skip-git-repo-check` — для `codex exec`, но **НЕ для `resume`**

---

## 4. Auto-Routing через Manifest

**manifest.json:**
```json
{
  "agents": [{
    "name": "translator",
    "triggers": ["translate", "переведи", "перевод"],
    "description": "Translates files"
  }]
}
```

**AGENTS.md** содержит инструкции для Основного Агента:
- Читать `manifest.json` перед началом задачи
- Если запрос содержит триггер — автоматически делегировать

---

## 5. VS Code Extension (Phase 3)

### Структура
```
subagent-manager/
├── src/providers/     # Adapters: codex, claude, gemini
├── src/library/       # Storage + Sharing
├── src/ui/            # React Webview
└── webview/           # React app
```

### Библиотека Sub-Agent'ов
```
~/.subagent-library/
├── library.json       # Индекс
└── agents/<name>/     # Агенты
```

### Формат `.subagent` (для sharing)
```json
{
  "version": "1.0",
  "metadata": { "id", "name", "description", "author", "tags" },
  "triggers": ["..."],
  "instructions": "...",
  "supportedAgents": ["codex", "claude", "gemini"],
  "agentConfigs": { ... }
}
```

### UI Flow
1. **Create:** Select CLI → Name → Edit Instructions → Triggers → Save
2. **Deploy:** Library → Agent → Scope (global/project) → CLI → Deploy
3. **Share:** Export `.subagent` → GitHub/Gist

---

## 6. Рекомендации

### Выбор Основного Агента
| CLI | Context | Exec+Resume | Рекомендация |
|-----|---------|-------------|--------------|
| Codex | 128K | ✅ | MVP, универсальный |
| Gemini | **1M** | ✅ | Оркестратор |
| Claude | 200K | ❓ | Требует проверки |

### Kimi K2 через Codex CLI
```bash
export OPENAI_API_KEY=sk-moonshot-key
export OPENAI_BASE_URL=https://api.moonshot.ai/v1
codex -m kimi-k2-0905-preview
```
