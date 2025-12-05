# VS Code Extension: SubAgent Manager — Архитектура

**Дата:** 2025-12-05
**Статус:** На рассмотрении
**Автор:** AI Assistant + User

---

## 1. Обзор

### Проблема
CLI-агенты (Codex, Claude) требуют ручной настройки Sub-Agent'ов через файлы и скрипты.

### Решение
VS Code Extension с React Webview для:
- Создания и редактирования Sub-Agent'ов через UI
- Управления локальной библиотекой
- Deploy в проект или глобально
- Export/Import `.subagent` файлов
- Browse community registry (Phase 2)

---

## 2. Поддерживаемые CLI-агенты

### Codex CLI ✅ MVP
- **Custom Commands:** `~/.codex/prompts/*.md`
- **Exec Mode:** `codex exec --full-auto`

### Claude Code ✅ MVP
- **Custom Commands:** `~/.claude/commands/*.md`
- **Exec Mode:** Требует проверки

### Custom 🔧
- **Custom Commands:** Через настройки
- **Exec Mode:** Configurable

---

## 3. Архитектура Extension

```
subagent-manager/
├── package.json                 # Extension manifest
├── tsconfig.json
├── src/
│   ├── extension.ts             # Entry point
│   ├── core/                    # Бизнес-логика
│   │   ├── SubAgentService.ts   # CRUD операции
│   │   ├── LibraryService.ts    # Локальная библиотека
│   │   └── DeployService.ts     # Deploy в проект/глобально
│   ├── providers/               # CLI adapters
│   │   ├── IAgentProvider.ts    # Интерфейс
│   │   ├── CodexProvider.ts     # Codex CLI
│   │   ├── ClaudeProvider.ts    # Claude Code
│   │   └── CustomProvider.ts    # User-defined
│   ├── webview/
│   │   └── WebviewProvider.ts   # React Webview host
│   └── test/                    # Unit tests
│       ├── SubAgentService.test.ts
│       └── providers/*.test.ts
├── webview-ui/                  # React приложение
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── AgentList.tsx
│   │   │   ├── AgentEditor.tsx
│   │   │   ├── TriggerManager.tsx
│   │   │   └── DeployDialog.tsx
│   │   ├── hooks/
│   │   └── api/                 # VS Code API bridge
│   └── vite.config.ts
└── .vscode/
    └── launch.json              # Debug configuration
```

---

## 4. Ключевые компоненты

### 4.1 IAgentProvider (Interface)

```typescript
interface IAgentProvider {
  readonly id: string;           // "codex" | "claude" | "custom"
  readonly name: string;
  readonly configPath: string;   // ~/.codex/prompts/ etc.
  
  // CRUD
  createAgent(agent: SubAgent): Promise<void>;
  readAgent(name: string): Promise<SubAgent | null>;
  updateAgent(agent: SubAgent): Promise<void>;
  deleteAgent(name: string): Promise<void>;
  listAgents(): Promise<SubAgent[]>;
  
  // Execution
  execAgent(name: string, task: string): Promise<ExecResult>;
}
```

### 4.2 SubAgent Model

```typescript
interface SubAgent {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  instructions: string;          // Markdown
  supportedProviders: string[];  // ["codex", "claude"]
  providerConfigs?: Record<string, ProviderConfig>;
  metadata: {
    author?: string;
    version?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  };
}
```

### 4.3 Библиотека (Library)

**Расположение:** `~/.subagent-library/`

```
~/.subagent-library/
├── library.json                 # Индекс
└── agents/
    └── <agent-id>/
        ├── agent.json           # SubAgent data
        └── instructions.md      # Инструкции (опционально отдельно)
```

**library.json:**
```json
{
  "version": "1.0",
  "agents": [
    {
      "id": "translator-v1",
      "name": "Translator",
      "path": "agents/translator-v1"
    }
  ]
}
```

---

## 5. Формат .subagent (Export/Import)

Единый JSON-файл для sharing:

```json
{
  "formatVersion": "1.0",
  "agent": {
    "id": "translator-v1",
    "name": "Translator",
    "description": "Translates files to any language",
    "triggers": ["translate", "переведи", "перевод"],
    "instructions": "# Translator Agent\n\nYou are a translation specialist...",
    "supportedProviders": ["codex", "claude"],
    "providerConfigs": {
      "codex": { "model": "gpt-4.1" },
      "claude": { "model": "claude-sonnet-4-20250514" }
    },
    "metadata": {
      "author": "user@example.com",
      "version": "1.0.0",
      "tags": ["translation", "i18n"]
    }
  }
}
```

---

## 6. UI Flow (React Webview)

### 6.1 Main View — Agent List

```
┌─────────────────────────────────────────────────────┐
│  SubAgent Manager                    [+ New Agent]  │
├─────────────────────────────────────────────────────┤
│  📚 Library (3)                                     │
│  ├── 📦 Translator          codex, claude           │
│  │   └── "переведи", "translate"                    │
│  ├── 📦 Code Reviewer       codex                   │
│  └── 📦 Docs Generator      claude                  │
│                                                     │
│  📁 Project: my-app (2)                             │
│  ├── 📦 test-runner         codex                   │
│  └── 📦 linter              codex                   │
├─────────────────────────────────────────────────────┤
│  [Import .subagent]  [Browse Community] (Phase 2)   │
└─────────────────────────────────────────────────────┘
```

### 6.2 Agent Editor

```
┌─────────────────────────────────────────────────────┐
│  Edit: Translator                      [Save] [X]   │
├─────────────────────────────────────────────────────┤
│  Name:        [Translator______________]            │
│  Description: [Translates files to any language___] │
│                                                     │
│  Providers:   [x] Codex  [x] Claude  [ ] Custom     │
│                                                     │
│  Triggers:                                          │
│  [translate] [переведи] [перевод] [+ Add]           │
│                                                     │
│  Instructions:                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ # Translator Agent                          │    │
│  │                                             │    │
│  │ You are a translation specialist...        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Deploy to Project]  [Deploy Global]  [Export]     │
└─────────────────────────────────────────────────────┘
```

---

## 7. Фазы реализации

### Phase 3 — MVP Extension (Локальная библиотека)

**Цель:** Работающий Extension с базовым функционалом

- **Stream 3.1:** Project scaffolding (Vite + React + TypeScript) — 5-7 файлов
- **Stream 3.2:** Core Services (SubAgentService, LibraryService) — 3 файла
- **Stream 3.3:** Codex Provider — 2 файла
- **Stream 3.4:** Claude Provider — 2 файла
- **Stream 3.5:** Webview UI — Agent List — 3 файла
- **Stream 3.6:** Webview UI — Agent Editor — 3 файла
- **Stream 3.7:** Deploy Service (project/global) — 2 файла
- **Stream 3.8:** Export/Import .subagent — 2 файла
- **Stream 3.9:** Unit Tests — 3-5 файлов
- **Stream 3.10:** Integration Testing + Docs — 2 файла

**Результат:** VSIX готов для локального использования

---

### Phase 4 — Community Registry

**Цель:** Browse и Install из community

- **Stream 4.1:** Создать GitHub repo `community-registry`
- **Stream 4.2:** Registry Service (fetch registry.json)
- **Stream 4.3:** Browse UI в Webview
- **Stream 4.4:** Install from registry
- **Stream 4.5:** Publish workflow (PR-based)

---

## 8. Технический стек

- **Extension:** TypeScript, VS Code API
- **Webview:** React 18, Vite, TypeScript
- **Styling:** CSS Modules или Vanilla CSS
- **Testing:** Vitest (unit), VS Code Test Runner
- **Linting:** Ultracite (Biome)
- **Build:** esbuild (extension), Vite (webview)

---

## 9. Верификация

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
3. Создать агента → Deploy в проект → Проверить файлы
4. Export → Import → Проверить целостность

---

## 10. Принятые решения

- **Название Extension:** `multicli-agents`
- **Publisher ID:** `OleksandrOliinyk`
- **Мин. версия VS Code:** 1.85+
- **GitHub username:** `OleksandrOliinyk`

