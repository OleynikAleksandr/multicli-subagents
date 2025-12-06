# План разработки (Development TODO Plan)

## Правила выполнения (Execution Rules):
- **TODO Plan** состоит из Phase (Фаз). В каждой Phase некоторое количество Stream (стримов).
- Каждая подзадача затрагивает **≤ 3 файлов**.
- **Gates**: после выполнения каждой подзадачи — Git Commit + обновление `todo-plan.md`.
- **Real-time Документация**: изменения архитектуры требуют обновления доков **ДО** коммита.

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
- [DONE] Тестирование auto-routing

---

## Phase 3 — VS Code Extension MVP (owner: AI, updated: 2025-12-05)

**Архитектура:** `doc/Project_Docs/VSCode_Extension_Architecture.md`

### Stream 3.1: Project Scaffolding
1. [DONE] Инициализация VS Code Extension вручную
   - Файлы: `package.json`, `tsconfig.json`, `src/extension.ts`
   - Commit: `feat: init vscode extension` (7d53180)
2. [DONE] Настройка Webview React 
   - Файлы: `webview-ui/package.json`, `webview-ui/vite.config.ts`, `webview-ui/src/App.tsx`
   - Commit: `feat: add webview react app` (31385c7)
3. [DONE] WebviewProvider + коммуникация Extension ↔ Webview
   - Файлы: `src/webview/webview-provider.ts`, `webview-ui/src/api/vscode.ts`
   - Commit: `feat: webview provider with message passing` (dc6aee3)

### Stream 3.2: Core Models & Services
4. [DONE] SubAgent модель и типы
   - Файлы: `src/models/sub-agent.ts`, `src/models/types.ts`
   - Commit: `feat: subagent model and types` (1a43caa)
5. [DONE] LibraryService (хранение)
   - Файлы: `src/core/library-service.ts`
   - Commit: `feat: library service for agent storage` (2f2f4fc)
6. [DONE] SubAgentService (Facade)
   - Файлы: `src/core/sub-agent-service.ts`
   - Commit: `feat: subagent service facade` (ebbff1c)

### Stream 3.3: Providers Integration
7. [DONE] CodexProvider (adapter)
   - Файлы: `src/providers/codex-provider.ts`
   - Commit: `feat: codex provider adapter` (c1c1621)
8. [DONE] ClaudeProvider (adapter)
   - Файлы: `src/providers/claude-provider.ts`
   - Commit: `feat: claude provider adapter` (ad0c0c3)
9. [DONE] Регистрация провайдеров
   - Файлы: extension.ts
   - Commit: `feat: register providers in extension activation` (415341e)

### Stream 3.4: Webview UI — Agent List
10. [DONE] AgentList компонент
    - Файлы: `webview-ui/src/components/agent-list.tsx`, CSS
    - Commit: `feat: agent list component` (07c7f24)
11. [DONE] Интеграция с LibraryService (fetch agents)
    - Файлы: `webview-ui/src/hooks/useAgents.ts`, `webview-ui/src/api/messages.ts`
    - Commit: `feat: backend support for agent listing` (d2c6743)

### Stream 3.5: Webview UI — Agent Editor
12. [DONE] AgentEditor компонент (форма)
    - Файлы: `webview-ui/src/components/agent-editor.tsx`, CSS
    - Integration: Triggers and Instructions fields included (Simplified MVP)
    - Commit: `feat: complete UI flow for agent editing` (5bb96e2)
13. [DONE] TriggerManager — управление триггерами
    - Implemented as comma-separated input in AgentEditor
    - Commit: `feat: complete UI flow for agent editing` (5bb96e2)
14. [DONE] Markdown редактор для инструкций
    - Implemented as textarea in AgentEditor
    - Commit: `feat: complete UI flow for agent editing` (5bb96e2)

### Stream 3.6: Deploy Service
15. [DONE] DeployService — deploy в проект/глобально
    - Файлы: `src/core/deploy-service.ts` (Implement project/global deploy)
    - Commit: `fix: lint errors in deploy service` (3133a4a)
16. [DONE] Deploy Buttons UI
    - Implemented as buttons in AgentEditor
    - Commit: `feat: complete UI flow for agent editing` (5bb96e2)

### Stream 3.7: Export/Import
17. [DONE] Export .subagent файл
    - Файлы: `src/core/export-import-service.ts`, UI update
    - Commit: `feat: export/import agents` (013d3d3)
18. [DONE] Import .subagent файл
    - Файлы: `src/core/export-import-service.ts`, UI update
    - Commit: `feat: export/import agents` (013d3d3)

### Stream 3.8: Unit Tests
19. [DONE] Тесты LibraryService
    - Файлы: `src/test/suite/library-service.test.ts`
    - Commit: `feat: implement offline unit testing infrastructure and tests` (47806a3)
20. [DONE] Тесты Providers
    - Файлы: `src/test/suite/providers.test.ts`
    - Commit: `feat: implement offline unit testing infrastructure and tests` (47806a3)
21. [DONE] Тесты SubAgentService
    - Файлы: `src/test/suite/sub-agent-service.test.ts`
    - Commit: `feat: implement offline unit testing infrastructure and tests` (47806a3)

### Stream 3.9: Integration & Documentation
22. [DONE] Integration testing (F5 → Extension Host)
    - Верификация: создать агента → deploy → проверить файлы
    - Commit: `feat: v0.0.4 - release` (Manual verification passed)
23. [DONE] Обновить README.md и документацию
    - Файлы: `README.md`, `doc/Project_Docs/VSCode_Extension_Architecture.md`
    - Commit: `docs: update README and Architecture for v0.0.1 release`

### Stream 3.10: SubAgent Architecture Refactoring

**Архитектура:** `doc/Project_Docs/SubAgent_Refactoring_Architecture.md`

#### Stream 3.10.1: Model Update
27. [DONE] Обновить модель SubAgent
    - Файлы: `src/models/sub-agent.ts`
    - Изменения: убрать `triggers[]`, добавить `commands.start/resume`, добавить `vendor`
    - Commit: `feat: update SubAgent model with vendor and commands`

28. [DONE] Обновить типы и зависимости
    - Файлы: `sub-agent.ts`, `types.ts`, `deploy-service.ts`, `sub-agent-service.ts`, `export-import-service.ts`, webview компоненты
    - Commit: `feat: update SubAgent model with vendor and commands`

#### Stream 3.10.2: Deploy Service Refactor
29. [DONE] Изменить папку деплоя на `.subagents/`
    - Файлы: `src/core/deploy-service.ts`
    - Изменения: `.codex/subagents/` → `.subagents/`
    - Commit: `refactor: deploy service with unified .subagents folder`

30. [DONE] Добавить Global deploy `~/.subagents/`
    - Файлы: `src/core/deploy-service.ts`
    - Commit: `refactor: deploy service with unified .subagents folder`

31. [DONE] Создание slash-команд для Main Agents
    - Файлы: `src/core/deploy-service.ts`
    - Создать: `.codex/prompts/call-subagent.md`, `.claude/commands/call-subagent.md`
    - Commit: `refactor: deploy service with unified .subagents folder`

#### Stream 3.10.3: UI Foundation
32. [DONE] Создать тёмную тему и base CSS
    - Файлы: `webview-ui/src/index.css`
    - Изменения: VS Code dark theme colors, CSS переменные, utility-классы
    - Commit: `style: dark theme UI foundation`

33. [DONE] Создать Home Screen
    - Файлы: `webview-ui/src/components/home-screen.tsx`
    - Изменения: две кнопки Create/Browse
    - Commit: `style: dark theme UI foundation`

34. [DONE] Обновить App.tsx с роутингом
    - Файлы: `webview-ui/src/App.tsx`
    - Изменения: state-based routing между screens (home, create, browse, edit)
    - Commit: `style: dark theme UI foundation`

#### Stream 3.10.4: Create Screen
35. [DONE] Создать Create Screen (форма)
    - Файлы: `webview-ui/src/components/agent-editor.tsx`
    - Реализовано через agent-editor с новыми CSS классами
    - Commit: `feat: improved UI with deploy modal and a11y`

36. [SKIPPED] Инструкции через temp файл
    - Отложено на будущее — textarea работает для MVP

37. [DONE] Генерация commands в UI
    - Файлы: `agent-editor.tsx`
    - Показывает start/resume read-only
    - Commit: `feat: improved UI with deploy modal and a11y`

#### Stream 3.10.5: Browse Screen
38. [DONE] Создать Browse Screen (список)
    - Файлы: `webview-ui/src/components/agent-list.tsx`
    - Карточки агентов с действиями
    - Commit: `feat: improved UI with deploy modal and a11y`

39. [DONE] Deploy Modal
    - Файлы: `agent-list.tsx`
    - Выбор: Project / Global
    - Commit: `feat: improved UI with deploy modal and a11y`

40. [DONE] Подключить Edit/Export/Delete/Import
    - Файлы: `agent-list.tsx`
    - Delete Modal с подтверждением
    - Commit: `feat: improved UI with deploy modal and a11y`

#### Stream 3.10.6: Cleanup & Verification
41. [TODO] Удалить старые компоненты
    - Файлы: `agent-list.tsx`, `agent-editor.tsx`
    - Commit: `refactor: remove old UI components`

42. [TODO] Создать UI Facade
    - Файлы: `webview-ui/src/components/ui-facade.ts`
    - Единая точка входа для всех компонентов
    - ⚠️ Каждый screen — отдельный файл < 150 строк!
    - Commit: `feat: UI facade pattern`

43. [TODO] Ручное тестирование и фиксы
    - F5 → тест полного flow
    - Commit: `fix: UI polish after testing`

---

## Phase 4 — Community Registry (БУДУЩЕЕ)

### Stream 4.1: Registry Infrastructure
- [TODO] Создать GitHub repo `community-registry`
- [TODO] registry.json структура

### Stream 4.2: Browse UI
- [TODO] RegistryService — fetch registry.json
- [TODO] BrowseAgents компонент в Webview
- [TODO] Install from registry

### Stream 4.3: Publish Workflow
- [TODO] Publish кнопка → Create PR в registry repo
- [TODO] Документация по publishing

---

## Верификация Phase 3

### Автоматические тесты
```bash
# Unit tests
npm run test

# Lint + Format
npx ultracite check
```

### Ручное тестирование
1. **F5** в VS Code → Extension Development Host
2. Cmd+Shift+P → "SubAgent Manager: Open"
3. Проверить Home Screen: две кнопки Create/Browse
4. Создать агента "test-agent" с vendor Codex
5. Deploy в проект → проверить:
   - `.subagents/test-agent/test-agent.md` существует
   - `.subagents/manifest.json` содержит агента с `commands`
   - `.codex/prompts/call-subagent.md` создан
   - `.claude/commands/call-subagent.md` создан
6. Deploy в Global → проверить `~/.subagents/`
7. Browse Screen: Edit/Export/Delete работают
8. Import .subagent файл
