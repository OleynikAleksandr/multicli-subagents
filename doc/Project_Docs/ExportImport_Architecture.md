# Export/Import Service Architectrue

**Статус:** Черновик
**Feature:** Экспорт и Импорт Sub-Agent'ов для обмена

## 1. Цель
Обеспечить возможность обмена агентами между разработчиками через файлы формата `.subagent`.

## 2. Формат файлов (.subagent)

Файл представляет собой JSON-экспорт структуры `SubAgent` с дополнительными метаданными для совместимости.

```json
{
  "formatVersion": "1.0",
  "exportedAt": "2023-10-27T10:00:00Z",
  "agent": {
    "id": "uuid-v4",
    "name": "Translator",
    "description": "Translates code and docs",
    "triggers": ["translate"],
    "instructions": "You are a translator...",
    "supportedProviders": ["codex"],
    "providerConfigs": {},
    "metadata": {
      "author": "user@res.com",
      "version": "1.0.0",
      "tags": ["utility"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

## 3. Архитектура сервисов

### 3.1 ExportService
Отвечает за сериализацию агента в JSON и сохранение файла.

**Методы:**
- `exportAgent(agent: SubAgent): Promise<void>`
  - Открывает диалог сохранения файла (`showSaveDialog`).
  - Записывает JSON.

### 3.2 ImportService
Отвечает за чтение файла, валидацию и добавление агента в библиотеку.

**Методы:**
- `importAgent(): Promise<void>`
  - Открывает диалог открытия файла (`showOpenDialog`).
  - Читает и парсит JSON.
  - Валидирует структуру (хотя бы наличие `name` и `instructions`).
  - Проверяет конфликты ID (генерирует новый ID при импорте или спрашивает замену).
  - Сохраняет через `LibraryService`.

## 4. UI Интеграция

- **AgentList:** Кнопка "Import Agent" (рядом с "New Agent").
- **AgentEditor:** Кнопка "Export" (в блоке Deployment или Header).

## 5. План реализации (Stream 3.7)

1. Создать `src/core/export-import-service.ts` (объединим для простоты или разделим).
2. Реализовать логику диалогов VS Code.
3. Добавить команды в `extension.ts` (`agent.export`, `agent.import` — можно через command palette или message passing).
4. Обновить `WebviewProvider` для обработки сообщений экспорта/импорта.
   - *Note:* Webview не может сам открывать системные диалоги сохранения/открытия, поэтому он шлет сообщение в Extension, а Extension открывает диалог.

## 6. Верификация
1. Создать агента.
2. Export -> `test.subagent`.
3. Удалить агента.
4. Import -> `test.subagent`.
5. Проверить, что агент появился.
