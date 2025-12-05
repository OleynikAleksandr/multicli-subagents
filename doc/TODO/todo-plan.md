# План разработки (Development TODO Plan)

## Правила выполнения (Execution Rules):
- Каждая подзадача — не более 3 файлов.
- **Gates**: после подзадачи — Git Commit.

---

## Phase 1 — MVP: Базовая инфраструктура Sub-Agent (updated: 2025-12-05)

### Stream 1.1: Создание скрипта — DONE ✅

1. [DONE] Базовый скрипт — `5b2ab8a`
2. [DONE] Исправить путь для slash-команды — `db8d05d`
3. [DONE] Добавить --skip-git-repo-check — `7bc1c3f`

### Stream 1.2: Верификация — DONE ✅

4. [DONE] Ручное тестирование
   - ✅ Структура директорий создаётся
   - ✅ `~/.codex/prompts/subagent.md` работает
   - ✅ Codex видит `/prompts:subagent`
   - ✅ Sub-Agent создал `hello.txt` (сессия `019aee0b-5811-7ba0-8ae7-59761f09830a`)

---

## Phase 2 — Развитие (Будущее)

### Stream 2.1: Интерактивное создание Sub-Agent'ов
- [TODO] Скрипт запрашивает имя, description, инструкции

### Stream 2.2: Мониторинг и логирование
- [TODO] Парсинг session_id из JSONL
- [TODO] Логирование сессий
