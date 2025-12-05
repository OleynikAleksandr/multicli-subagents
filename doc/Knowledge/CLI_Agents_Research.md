# Исследование CLI-агентов для Sub-Agent системы

**Дата:** 2025-12-05  
**Статус:** Завершено

---

## 1. Codex CLI (OpenAI) ✅ ПРОВЕРЕНО

### Custom Commands
- **Глобальные:** `~/.codex/prompts/*.md`
- **Формат:** Markdown + YAML frontmatter
- **Вызов:** `/prompts:<name>`

### Non-Interactive Mode
```bash
codex exec --full-auto --add-dir "$(pwd)" -C "$(pwd)" "prompt"
```

### Resume Session
```bash
codex exec resume <SESSION_ID> "follow-up prompt"
```

### Важные флаги
- `--full-auto` — автоматическое одобрение
- `--skip-git-repo-check` — работа вне git (только для `exec`, НЕ для `resume`)
- `--add-dir $(pwd)` — доступ к воркспейсу

### MCP Client
⚠️ **Нестабильный** — множество issues на GitHub:
- Connection failures
- Handshaking fails
- Короткий startup timeout

---

## 2. Gemini CLI (Google) ✅ ПРОВЕРЕНО

### Custom Commands
- **Глобальные:** `~/.gemini/commands/*.toml`
- **Проектные:** `.gemini/commands/*.toml`
- **Формат:** TOML с `prompt`, `description`, `{{args}}`

### Non-Interactive Mode (Headless)
```bash
gemini -p "Your prompt here"
cat file.txt | gemini -p "Summarize"
```

### Resume Session
```bash
gemini --resume -p "continue"
gemini --resume <UUID> -p "next step"
gemini --resume 0 -p "by index"
```

### Особенности
- **1M context window** — лучший для Оркестратора
- `!{shell command}` — выполнение shell в промптах
- Extensions — пакеты через GitHub

### Сессии
Хранятся в: `~/.gemini/tmp/<project_hash>/chats/`

---

## 3. Claude Code CLI (Anthropic) 🔄 ЧАСТИЧНО

### Custom Commands
- **Глобальные:** `~/.claude/commands/*.md`
- **Проектные:** `.claude/commands/*.md`
- **Формат:** Markdown + frontmatter

### Custom API Endpoint
```bash
export ANTHROPIC_BASE_URL=https://custom-endpoint
export ANTHROPIC_API_KEY=sk-...
```

### Статус
- ❓ Нужна проверка exec/resume в non-interactive mode

---

## 4. Kimi CLI (Moonshot AI) 🔬 ИССЛЕДОВАНИЕ

### Аутентификация
```bash
export KIMI_API_KEY=sk-...
# ИЛИ (OpenAI-совместимый)
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.moonshot.ai/v1
```

### API
- **OpenAI-совместимый** — работает с Codex CLI
- **Модели:** `kimi-k2-0905-preview`, `kimi-k2-turbo-preview`

### Проблемы
- ❌ Нет явных custom slash-commands
- ❌ Только интерактивный режим (Agent Mode / Shell Mode)

### Решение: Kimi K2 через Codex CLI
```bash
export OPENAI_API_KEY=sk-moonshot-key
export OPENAI_BASE_URL=https://api.moonshot.ai/v1
codex -m kimi-k2-0905-preview
```

Или в `~/.codex/config.toml`:
```toml
[providers.moonshot]
base_url = "https://api.moonshot.ai/v1"
api_key_env = "MOONSHOT_API_KEY"

model = "kimi-k2-0905-preview"
model_provider = "moonshot"
```

---

## 5. Сравнительная таблица

| Функция | Codex | Gemini | Claude | Kimi |
|---------|-------|--------|--------|------|
| Custom Commands | ✅ md | ✅ toml | ✅ md | ❌ |
| Exec Non-Interactive | ✅ | ✅ | ❓ | ❌ |
| Resume + Prompt | ✅ | ✅ | ❓ | ❌ |
| Context Window | 128K | **1M** | 200K | 256K |
| OpenAI-compatible | ✅ | — | — | ✅ |
| MCP Support | ⚠️ buggy | ✅ | ✅ | ✅ |

---

## 6. Тесты Sub-Agent системы

### Тест 1: Простая задача
```
/prompts:subagent AGENT=example TASK="Create hello.txt"
```
**Результат:** ✅ Sub-Agent создал файл

### Тест 2: Двухходовочка (Resume)
```
/prompts:subagent AGENT=example TASK="Create a file with user preferences"
```
**Результат:**
1. ✅ Sub-Agent создал `user-preferences.json`
2. ✅ Sub-Agent задал уточняющий вопрос
3. ✅ Основной Агент автономно ответил через `codex exec resume`
4. ✅ Sub-Agent завершил задачу

### Тест 3: Auto-Routing
```
Пользователь: "нужно сделать перевод на английский - 01.md"
```
**Результат:**
1. ✅ Основной Агент прочитал `manifest.json`
2. ✅ Нашёл триггер "перевод" → translator
3. ✅ Автоматически делегировал через `codex exec`
4. ✅ translator Sub-Agent создал `01_en.md`

---

## 7. Рекомендации

### Основной Агент
- **MVP:** Codex CLI — проверено, стабильно
- **Оркестратор:** Gemini CLI — 1M контекст

### Sub-Agent'ы
- Через `codex exec --full-auto` — универсально
- Manifest-based routing — автоматическая делегация

### Избегать
- MCP в Codex CLI — нестабильно
- Kimi CLI как Основной Агент — нет custom commands
