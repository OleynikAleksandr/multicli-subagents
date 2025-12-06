// biome-ignore lint/performance/noNamespaceImport: VS Code API
import * as vscode from "vscode";

export class MockMemento implements vscode.Memento {
  // biome-ignore lint/suspicious/noExplicitAny: Mock data
  private _data = new Map<string, any>();

  keys(): readonly string[] {
    return Array.from(this._data.keys());
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  // biome-ignore lint/suspicious/noExplicitAny: Mock implementation
  get(key: string, defaultValue?: any): any {
    const value = this._data.get(key);
    return value !== undefined ? value : defaultValue;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Mock implementation
  update(key: string, value: any): Thenable<void> {
    this._data.set(key, value);
    return Promise.resolve();
  }
}

export const createMockContext = (): vscode.ExtensionContext => {
  const globalState = new MockMemento();
  const workspaceState = new MockMemento();

  return {
    globalState,
    workspaceState,
    subscriptions: [],
    extensionPath: "",
    storagePath: "",
    globalStoragePath: "",
    logPath: "",
    asAbsolutePath: (relativePath: string) => relativePath,
    extensionUri: vscode.Uri.file(""),
    globalStorageUri: vscode.Uri.file(""),
    logUri: vscode.Uri.file(""),
    extensionMode: vscode.ExtensionMode.Test,
    environmentVariableCollection: {} as any,
    secrets: {} as any,
    storageUri: undefined,
  } as unknown as vscode.ExtensionContext;
};
