// biome-ignore lint/performance/noNamespaceImport: VS Code API
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "multicli-agents" is now active!');

  const disposable = vscode.commands.registerCommand(
    "multicli-agents.open",
    () => {
      vscode.window.showInformationMessage("SubAgent Manager Initialized!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Deactivation logic will go here
}
