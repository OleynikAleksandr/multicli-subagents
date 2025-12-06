// biome-ignore lint/performance/noNamespaceImport: Test utils
// biome-ignore lint/style/useNodejsImportProtocol: Test utils
import * as assert from "assert";
import { ClaudeProvider } from "../../providers/claude-provider";
import { CodexProvider } from "../../providers/codex-provider";

// biome-ignore lint/correctness/noUndeclaredVariables: Mocha globals
suite("Providers Test Suite", () => {
  test("CodexProvider", () => {
    const provider = new CodexProvider();
    assert.strictEqual(provider.id, "codex");
    assert.strictEqual(provider.name, "Codex CLI");
  });

  test("ClaudeProvider", () => {
    const provider = new ClaudeProvider();
    assert.strictEqual(provider.id, "claude");
    assert.strictEqual(provider.name, "Claude Code CLI");
  });
});
