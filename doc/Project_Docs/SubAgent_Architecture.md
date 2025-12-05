# Архитектура системы Sub-Agent для Codex CLI

## Описание проблемы

Codex CLI не имеет встроенного механизма для запуска Sub-Agent'ов из основного диалога. Пользователь хочет делегировать задачи в фоновый процесс, сохраняя возможность продолжить сессию Sub-Agent'а при необходимости.

## Решение

Bash-скрипт `codex-setup-subagents.sh`, который создаёт инфраструктуру для работы с Sub-Agent'ами.

---

## Архитектура

```
~/.codex/
└── prompts/
    └── subagent.md                ← Глобальная slash-команда

workspace/
├── AGENTS.md                      ← Основной агент (Codex читает)
└── .codex/
    └── subagents/
        └── <имя-агента>/
            └── <имя-агента>.md    ← Инструкция Sub-Agent'а
```

> [!IMPORTANT]  
> **Slash-команды Codex CLI хранятся ГЛОБАЛЬНО в `~/.codex/prompts/`!**  
> Локальные `.codex/prompts/` в проекте НЕ поддерживаются.
> **Вызов команды:** `/prompts:subagent` или просто набрать `subagent` в slash-popup.

> [!IMPORTANT]  
> **Файл инструкций Sub-Agent'а НЕ должен называться `AGENTS.md`!**  
> Codex ищет `AGENTS.md` во всех вложенных папках.  
> **Решение:** `<имя-агента>.md` — уникальное имя, совпадающее с именем папки.

---

## Компоненты

### 1. Глобальная Slash-команда `/prompts:subagent`

**Файл:** `~/.codex/prompts/subagent.md`

**Формат (согласно документации Codex):**
- Frontmatter: `description`, `argument-hint`
- Placeholders: `$1`–`$9`, `$ARGUMENTS`, `KEY=value`

### 2. Локальные Sub-Agent'ы в проекте

**Директория:** `.codex/subagents/<имя-агента>/`

- `<имя-агента>.md` — инструкции для Sub-Agent'а

---

## Флаги codex exec

- `--full-auto` — автоматическое одобрение + sandbox workspace-write
- `--add-dir $(pwd)` — полный доступ к воркспейсу
- `-C $(pwd)` — рабочая директория = корень репозитория

---

## Скрипт `codex-setup-subagents.sh` (v1 - MVP)

### Что создаёт

1. `~/.codex/prompts/subagent.md` — глобальная slash-команда (ЕСЛИ не существует)
2. `.codex/subagents/` — локальная директория для Sub-Agent'ов проекта
3. `.codex/subagents/example/example.md` — пример Sub-Agent'а

---

## План верификации

1. Запустить `./codex-setup-subagents.sh`
2. Перезапустить Codex CLI (команды загружаются при старте сессии)
3. Набрать `/` и проверить наличие `prompts:subagent`
4. Вызвать `/prompts:subagent example "Создай файл hello.txt"`
5. Проверить выполнение
