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
17. [TODO] Export .subagent файл
    - Файлы: `src/core/ExportService.ts`
    - Commit: `feat: export subagent`
18. [TODO] Import .subagent файл
    - Файлы: `src/core/ImportService.ts`, UI обновления
    - Commit: `feat: import subagent`

### Stream 3.8: Unit Tests
19. [TODO] Тесты LibraryService
    - Файлы: `src/test/LibraryService.test.ts`
    - Commit: `test: library service`
20. [TODO] Тесты Providers
    - Файлы: `src/test/CodexProvider.test.ts`, `src/test/ClaudeProvider.test.ts`
    - Commit: `test: providers`
21. [TODO] Тесты SubAgentService
    - Файлы: `src/test/SubAgentService.test.ts`
    - Commit: `test: subagent service`

### Stream 3.9: Integration & Documentation
22. [TODO] Integration testing (F5 → Extension Host)
    - Верификация: создать агента → deploy → проверить файлы
    - Commit: `test: integration`
23. [TODO] Обновить README.md и документацию
    - Файлы: `README.md`, `doc/Project_Docs/VSCode_Extension_Architecture.md`
    - Commit: `docs: extension usage`

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
3. Создать агента "test-agent"
4. Deploy в проект → проверить `.codex/subagents/test-agent/`
5. Export → Import → проверить целостность
