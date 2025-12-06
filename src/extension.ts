// biome-ignore lint/performance/noNamespaceImport: VS Code API
import * as vscode from "vscode";

import { WebviewProvider } from "./webview/webview-provider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "multicli-agents" is now active!');

  const provider = new WebviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WebviewProvider.viewType,
      provider
    )
  );

  const disposable = vscode.commands.registerCommand(
    "multicli-agents.open",
    () => {
      vscode.commands.executeCommand(
        "workbench.view.extension.multicli-agents-view"
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Deactivation logic will go here
}
