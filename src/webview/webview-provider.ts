// biome-ignore lint/performance/noNamespaceImport: VS Code API
import * as vscode from "vscode";
import type { SubAgentService } from "../core/sub-agent-service";

export class WebviewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = "multicli-agents.webview";
  private _view?: vscode.WebviewView;
  private readonly _extensionUri: vscode.Uri;
  private readonly _subAgentService: SubAgentService;

  constructor(extensionUri: vscode.Uri, subAgentService: SubAgentService) {
    this._extensionUri = extensionUri;
    this._subAgentService = subAgentService;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "hello": {
          vscode.window.showInformationMessage(data.payload.text);
          break;
        }
        case "agent.list": {
          const agents = await this._subAgentService.getAgents();
          if (this._view) {
            this._view.webview.postMessage({
              command: "agent.list.result",
              payload: agents,
            });
          }
          break;
        }
        case "agent.create": {
          await this._subAgentService.createAgent(data.payload);
          vscode.window.showInformationMessage(
            `Agent ${data.payload.name} created!`
          );
          // Trigger refresh
          const agents = await this._subAgentService.getAgents();
          if (this._view) {
            this._view.webview.postMessage({
              command: "agent.list.result",
              payload: agents,
            });
          }
          break;
        }
        case "agent.update": {
          await this._subAgentService.updateAgent(data.payload);
          vscode.window.showInformationMessage(
            `Agent ${data.payload.name} updated!`
          );
          // Trigger refresh
          const agents = await this._subAgentService.getAgents();
          if (this._view) {
            this._view.webview.postMessage({
              command: "agent.list.result",
              payload: agents,
            });
          }
          break;
        }
        case "agent.delete": {
          await this._subAgentService.deleteAgent(data.payload.id);
          vscode.window.showInformationMessage("Agent deleted!");
          // Trigger refresh
          const agents = await this._subAgentService.getAgents();
          if (this._view) {
            this._view.webview.postMessage({
              command: "agent.list.result",
              payload: agents,
            });
          }
          break;
        }
        default:
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const assetsUri = vscode.Uri.joinPath(
      this._extensionUri,
      "out",
      "webview",
      "assets"
    );

    // Get the build manifest to find the correct file names
    // For simplicity in MVP, we assume rigid naming or use a glob pattern if needed.
    // However, Vite build with our config produces specific names or we can rely on standard Vite behavior.
    // In our vite.config.ts we set entryFileNames: `assets/[name].js`.
    // Let's verify what the build actually produced.

    // Note: In a real production extension, we usually read manifest.json or directory to find hashed filenames.
    // Since we configured vite.config.ts to output predictable names (assets/index.js), we can try that.

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(assetsUri, "index.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(assetsUri, "index.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${styleUri}" />
        <title>SubAgent Manager</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
