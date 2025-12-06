export interface WebviewMessage {
    command: string;
    payload?: any;
}

type VSCodeApi = {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
};

// Declare the acquireVsCodeApi function that is available in the global scope of the webview
declare const acquireVsCodeApi: () => VSCodeApi;

class VSCodeWrapper {
    private readonly vsCodeApi: VSCodeApi | undefined;

    constructor() {
        if (typeof acquireVsCodeApi === 'function') {
            this.vsCodeApi = acquireVsCodeApi();
        }
    }

    public postMessage(message: unknown) {
        if (this.vsCodeApi) {
            this.vsCodeApi.postMessage(message);
        } else {
            console.log('VS Code Message:', message);
        }
    }

    public getState(): unknown {
        if (this.vsCodeApi) {
            return this.vsCodeApi.getState();
        }
        return undefined;
    }

    public setState(state: unknown) {
        if (this.vsCodeApi) {
            this.vsCodeApi.setState(state);
        }
    }
}

export const vscode = new VSCodeWrapper();
