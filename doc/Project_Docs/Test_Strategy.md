# Стратегия тестирования (Stream 3.8)

**Feature:** Инфраструктура модульного тестирования (Offline / Mocked).

## 1. Цель
Реализовать надежную инфраструктуру модульного тестирования с использованием `mocha` и мокирования `vscode` API. Использование стандартного запускатора `vscode-test` (integration tests) оказалось нестабильным в текущем окружении. Переход на "Offline" тестирование позволяет проверять бизнес-логику быстрее и надежнее без запуска Extension Host.

## 2. Настройка инфраструктуры
Создание инфраструктуры для выполнения тестов в среде Node.js с моками:

- `src/test/vscode-mock.ts`: Мок-реализация основных API VS Code (`Memento`, `ExtensionContext`, `Uri`, `Disposable`).
- `src/test/runTestOffline.ts`: Скрипт запуска, который перехватывает импорты `vscode` и подменяет их на мок, затем запускает Mocha.
- `src/test/suite/*.test.ts`: Существующие файлы тестов (они не требуют изменений, так как `runTestOffline` делает подмену прозрачно).

**Зависимости:**
- `mocha`: Фреймворк тестирования.
- `glob`: Поиск файлов.
- (Опционально) `module-alias` или кастомный loader.

## 3. План покрытия тестами

### 3.1 Тесты LibraryService
**Файл:** `src/test/suite/library-service.test.ts`
**Целевой класс:** `LibraryService`
**Сценарии:**
1.  **Storage:** Проверка корректного сохранения агентов в мокированный `globalState`.
2.  **Retrieval:** Проверка, что `getAgents()` возвращает сохраненных агентов.
3.  **Persistence:** Проверка сохранения данных.

### 3.2 Тесты Провайдеров
**Файл:** `src/test/suite/providers.test.ts`
**Целевые классы:** `CodexProvider`, `ClaudeProvider`
**Сценарии:**
1.  **Properties:** Проверка `id` и `name`.
2.  **Commands:** Проверка генерации команд CLI (если применимо).

### 3.3 Тесты SubAgentService
**Файл:** `src/test/suite/sub-agent-service.test.ts`
**Целевой класс:** `SubAgentService`
**Сценарии:**
1.  **CRUD:** проверка вызовов `createAgent`, `updateAgent`, `deleteAgent`.
2.  **Validation:** проверка валидации и генерации ID.

## 4. План Верификации

### Автоматическая ("Offline")
Запуск команды: `npm run test:offline` (будет добавлена в package.json).
Команда выполнит: `tsc -p ./ && node out/test/runTestOffline.js`.

### Ручная
Не требуется.
