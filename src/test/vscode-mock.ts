// Mock implementation of VS Code API for offline testing

export class Disposable {
  dispose(): any {}
}

export class EventEmitter {
  event = () => {};
  fire(): any {}
  dispose(): any {}
}

export const Uri = {
  file: (f: string) => ({
    fsPath: f,
    path: f,
    scheme: "file",
    toString: () => f,
  }),
  parse: (f: string) => ({
    fsPath: f,
    path: f,
    scheme: "file",
    toString: () => f,
  }),
};

export const window = {
  showInformationMessage: () => Promise.resolve(),
  showErrorMessage: () => Promise.resolve(),
  showOpenDialog: () => Promise.resolve([]),
  createOutputChannel: () => ({
    appendLine: () => {},
    show: () => {},
    dispose: () => {},
  }),
  createStatusBarItem: () => ({
    show: () => {},
    hide: () => {},
    dispose: () => {},
  }),
};

export const workspace = {
  getConfiguration: () => ({
    get: (key: string, defaultValue?: any) => defaultValue,
    update: () => Promise.resolve(),
  }),
  onDidChangeConfiguration: () => ({ dispose: () => {} }),
};

export const commands = {
  registerCommand: (command: string, callback: (...args: any[]) => any) => ({
    dispose: () => {},
  }),
  executeCommand: () => Promise.resolve(),
};

export const ExtensionMode = {
  Production: 1,
  Development: 2,
  Test: 3,
};

// Memento Mock
export class MockMemento {
  private _data = new Map<string, any>();

  keys(): readonly string[] {
    return Array.from(this._data.keys());
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const value = this._data.get(key);
    return value !== undefined ? value : defaultValue;
  }

  update(key: string, value: any): Thenable<void> {
    this._data.set(key, value);
    return Promise.resolve();
  }
}
