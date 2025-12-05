# План разработки (Development TODO Plan)

## Правила выполнения (Execution Rules):
- **TODO Plan** состоит из Phase (Фаз). В каждой Phase некоторое колличество - Stream (стрим), в каждом Стриме - некоторое кол-во подзадач.
- Каждая подзадача должна затрагивать не более 3 файлов.
- **Gates**: после выполнения каждой подзадачи — Git Commit с релевантным описанием.
- **Real-time Документация**: изменения архитектуры требуют обновления документации ДО коммита.

---

## Phase 1 — MVP: Базовая инфраструктура Sub-Agent (owner: AI, updated: 2025-12-05)

### Stream 1.1: Создание скрипта `codex-setup-subagents.sh`

1. [DONE] **Создать базовый скрипт** — `5b2ab8a`
   - Файлы: `codex-setup-subagents.sh`
   - Задача: Скрипт создаёт директории

2. [DONE] **Исправить путь для slash-команды** — `db8d05d`
   - Файлы: `codex-setup-subagents.sh`, `doc/Project_Docs/SubAgent_Architecture.md`
   - Задача: Slash-команда в `~/.codex/prompts/` (глобально), вызов `/prompts:subagent`

3. [DONE] **Пример Sub-Agent'а**
   - Файлы: скрипт создаёт `.codex/subagents/example/example.md`

---

### Stream 1.2: Верификация

4. [IN_PROGRESS] **Ручное тестирование**
   - Задача: Протестировать скрипт
   - Проверки:
     - [x] Структура директорий создаётся
     - [x] `~/.codex/prompts/subagent.md` существует
     - [ ] Codex видит `/prompts:subagent` (ТРЕБУЕТ ПЕРЕЗАПУСКА CODEX)
     - [ ] Sub-Agent запускается

---

## Phase 2 — Развитие (Будущее)

### Stream 2.1: Интерактивное создание Sub-Agent'ов

- [TODO] Скрипт запрашивает имя, description, инструкции
- [TODO] Валидация имени (без спецсимволов)
- [TODO] Генерация шаблона инструкций

### Stream 2.2: Мониторинг и логирование

- [TODO] Парсинг session_id из JSONL-вывода
- [TODO] Логирование сессий Sub-Agent'ов
