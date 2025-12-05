# План разработки (Development TODO Plan)

## Правила выполнения (Execution Rules):
- **TODO Plan** состоит из Phase (Фаз). В каждой Phase некоторое колличество - Stream (стрим), в каждом Стриме - некоторое кол-во подзадач.
- Каждая подзадача должна затрагивать не более 3 файлов.
- **Gates**: после выполнения каждой подзадачи — Git Commit с релевантным описанием.
- **Real-time Документация**: изменения архитектуры требуют обновления документации ДО коммита.

---

## Phase 1 — MVP: Базовая инфраструктура Sub-Agent (owner: AI, updated: 2025-12-05)

### Stream 1.1: Создание скрипта `codex-setup-subagents.sh`

1. [TODO] **Создать базовый скрипт**
   - Файлы: `codex-setup-subagents.sh`
   - Задача: Скрипт создаёт директории `.codex/prompts/` и `.codex/subagents/`
   - Commit: `feat: add codex-setup-subagents.sh scaffold`

2. [TODO] **Добавить создание slash-команды `/subagent`**
   - Файлы: `codex-setup-subagents.sh`
   - Задача: Скрипт создаёт `.codex/prompts/subagent.md` с полной инструкцией
   - Commit: `feat: add /subagent slash-command creation`

3. [TODO] **Добавить пример Sub-Agent'а**
   - Файлы: `codex-setup-subagents.sh`
   - Задача: Скрипт создаёт `.codex/subagents/example/example.md` с примером инструкций
   - Commit: `feat: add example sub-agent template`

---

### Stream 1.2: Верификация

4. [TODO] **Ручное тестирование**
   - Задача: Протестировать скрипт в тестовом воркспейсе
   - Проверки:
     - Структура директорий создаётся корректно
     - Codex видит команду `/subagent`
     - Sub-Agent запускается через `codex exec`
   - Commit: `docs: add verification results to walkthrough`

---

## Phase 2 — Развитие (Будущее)

### Stream 2.1: Интерактивное создание Sub-Agent'ов

- [TODO] Скрипт запрашивает имя, description, инструкции
- [TODO] Валидация имени (без спецсимволов)
- [TODO] Генерация шаблона инструкций

### Stream 2.2: Мониторинг и логирование

- [TODO] Парсинг session_id из JSONL-вывода
- [TODO] Логирование сессий Sub-Agent'ов
- [TODO] Dashboard статусов
