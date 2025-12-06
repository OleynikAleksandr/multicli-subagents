# Дизайн Deploy Service

**Статус:** Черновик
**Функция:** Деплой саб-агентов в Проект (Project) или Глобально (Global)

## 1. Цель
Реализовать функцию "Deploy" в расширении VS Code, чтобы Sub-Agent'ы стали доступны для использования в CLI (`codex`, `claude`) внутри текущего проекта или глобально.

## 2. Стратегии развертывания

### A. Уровень Проекта (Project Scope) — Основной
Развертывание агента в конфигурацию `.codex` текущего рабочего пространства (workspace).

**Целевая директория:** `<workspace-root>/.codex/subagents/`

**Действия:**
1. **Создать директорию:** `.codex/subagents/<agent-name>/`
2. **Записать инструкции:** Сохранить инструкции агента в `.codex/subagents/<agent-name>/<agent-name>.md`.
3. **Обновить манифест:** Чтение/Обновление `.codex/subagents/manifest.json`.
   - Добавить/Обновить запись в массиве `agents`:
     ```json
     {
       "name": "agent-name",
       "triggers": ["trigger1", "trigger2"],
       "description": "Описание агента"
     }
     ```

### B. Глобальный уровень (Global Scope) — Второстепенный
Развертывание агента в конфигурацию домашней директории пользователя.

**Целевая директория:** `~/.codex/prompts/` (для Codex CLI)

**Действия:**
1. **Записать промпт:** Сохранить инструкции в `~/.codex/prompts/<agent-name>.md`.
   - Это активирует slash-команду `<agent-name>` локально.
   - Согласно архитектуре: "Slash-команды Codex CLI — ГЛОБАЛЬНО в `~/.codex/prompts/`".

## 3. Детали реализации

### `src/core/deploy-service.ts`
```typescript
export class DeployService {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async deployToProject(agent: SubAgent, folder: vscode.WorkspaceFolder): Promise<void> {
    // 1. Проверить существование .codex/subagents
    // 2. Записать файл инструкций
    // 3. Обновить manifest.json
  }

  async deployToGlobal(agent: SubAgent): Promise<void> {
    // 1. Определить путь HOME
    // 2. Записать в ~/.codex/prompts/
  }
}
```

### Интеграция в UI
- **DeployDialog:** Модальное окно или QuickPick для выбора "Project" или "Global".
- **AgentEditor:** Кнопка "Deploy".
- **AgentList:** Кнопка "Deploy" на карточке агента.

## 4. Верификация
1. Создать агента "test-deploy".
2. Нажать "Deploy to Project".
3. Проверить файловую систему: `.codex/subagents/test-deploy/test-deploy.md`.
4. Проверить наличие записи в `manifest.json`.
