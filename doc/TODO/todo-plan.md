# План разработки (Development TODO Plan)

---

## Phase 1 — MVP: Базовая инфраструктура — DONE ✅ (2025-12-05)

- [DONE] Скрипт `codex-setup-subagents.sh`
- [DONE] Slash-команда `/prompts:subagent`
- [DONE] Тестирование двухходовочки (resume)

---

## Phase 2 — Auto-Routing — DONE ✅ (2025-12-05)

- [DONE] `manifest.json` с триггерами — `6cbab10`
- [DONE] Sub-Agent `translator`
- [DONE] `AGENTS.md` с правилами авто-маршрутизации
- [DONE] Тестирование: "перевод на английский - 01.md" → автоматическая делегация!

---

## Phase 3 — Развитие (Будущее)

### Stream 3.1: Интерактивное создание Sub-Agent'ов
- [TODO] Скрипт запрашивает имя, description, триггеры
- [TODO] Добавление в manifest.json

### Stream 3.2: Мониторинг
- [TODO] Парсинг session_id из JSONL
- [TODO] Логирование сессий

### Stream 3.3: Дополнительные Sub-Agent'ы
- [TODO] code-reviewer
- [TODO] test-runner
- [TODO] docs-generator
