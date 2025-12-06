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
4. [DONE] WebviewProvider + коммуникация Extension ↔ Webview
   - Файлы: `src/webview/webview-provider.ts`, `webview-ui/src/api/vscode.ts`
   - Commit: `feat: webview provider with message passing` (dc6aee3)

### Stream 3.2: Core Models & Services
4. [TODO] SubAgent модель и типы
   - Файлы: `src/models/SubAgent.ts`, `src/models/types.ts`
   - Commit: `feat: subagent model`
5. [TODO] LibraryService — CRUD для локальной библиотеки
   - Файлы: `src/core/LibraryService.ts`
   - Commit: `feat: library service`
6. [TODO] SubAgentService — фасад для работы с агентами
   - Файлы: `src/core/SubAgentService.ts`
   - Commit: `feat: subagent service facade`

### Stream 3.3: CLI Providers
7. [TODO] IAgentProvider интерфейс
   - Файлы: `src/providers/IAgentProvider.ts`
   - Commit: `feat: agent provider interface`
8. [TODO] CodexProvider — адаптер для Codex CLI
   - Файлы: `src/providers/CodexProvider.ts`
   - Commit: `feat: codex provider`
9. [TODO] ClaudeProvider — адаптер для Claude Code CLI
   - Файлы: `src/providers/ClaudeProvider.ts`
   - Commit: `feat: claude provider`

### Stream 3.4: Webview UI — Agent List
10. [TODO] AgentList компонент
    - Файлы: `webview-ui/src/components/AgentList.tsx`, CSS
    - Commit: `feat: agent list component`
11. [TODO] Интеграция с LibraryService (fetch agents)
    - Файлы: `webview-ui/src/hooks/useAgents.ts`, `webview-ui/src/api/messages.ts`
    - Commit: `feat: fetch agents from library`

### Stream 3.5: Webview UI — Agent Editor
12. [TODO] AgentEditor компонент (форма)
    - Файлы: `webview-ui/src/components/AgentEditor.tsx`, CSS
    - Commit: `feat: agent editor form`
13. [TODO] TriggerManager — управление триггерами
    - Файлы: `webview-ui/src/components/TriggerManager.tsx`
    - Commit: `feat: trigger manager`
14. [TODO] Markdown редактор для инструкций
    - Файлы: `webview-ui/src/components/InstructionsEditor.tsx`
    - Commit: `feat: markdown instructions editor`

### Stream 3.6: Deploy Service
15. [TODO] DeployService — deploy в проект/глобально
    - Файлы: `src/core/DeployService.ts`
    - Commit: `feat: deploy service`
16. [TODO] DeployDialog UI
    - Файлы: `webview-ui/src/components/DeployDialog.tsx`
    - Commit: `feat: deploy dialog`

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
