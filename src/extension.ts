import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("react-webview.start", () => {
      ReactPanel.createOrShow(path.join(context.extensionPath));
    })
  );
}

class ReactPanel {
  public static currentPanel: ReactPanel | undefined;
  private static readonly viewType = "webxdao";
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  public static createOrShow(extensionPath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel._panel.reveal(column);
    } else {
      ReactPanel.currentPanel = new ReactPanel(
        extensionPath,
        column || vscode.ViewColumn.One
      );
    }
  }
  private constructor(extensionPath: string, column: vscode.ViewColumn) {
    this._extensionPath = extensionPath;
    this._panel = vscode.window.createWebviewPanel(
      ReactPanel.viewType,
      "WebXDAO",
      column,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "build"))
        ]
      }
    );
    this._panel.webview.html = this._getHtmlForWebview();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }
  /**
   * Dispose all disposables
   */
  public dispose() {
    ReactPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview() {
    const scriptPathOnDisk = this._panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this._extensionPath, "build", "main.js"))
    );
    const stylePathOnDisk = this._panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this._extensionPath, "build", "style.css"))
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>WebXDAO Extension</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
        <div>Hello</div>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptPathOnDisk}" defer></script>
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

export function deactivate() {}
