// biome-ignore lint/performance/noNamespaceImport: Test utils
// biome-ignore lint/style/useNodejsImportProtocol: Test utils
import * as assert from "assert";
import { LibraryService } from "../../core/library-service";
import type { SubAgent } from "../../models/sub-agent";
import { createMockContext } from "./mock-context";

// biome-ignore lint/correctness/noUndeclaredVariables: Mocha globals
suite("LibraryService Test Suite", () => {
  test("Initial state is empty", async () => {
    const context = createMockContext();
    const service = new LibraryService(context);
    const agents = await service.getAgents();
    assert.strictEqual(agents.length, 0);
  });

  test("Save and Retrieve Agents", async () => {
    const context = createMockContext();
    const service = new LibraryService(context);

    const agent1: SubAgent = {
      id: "1",
      name: "Test Agent",
      description: "Desc",
      triggers: ["test"],
      instructions: "Do test",
      supportedProviders: ["codex"],
      providerConfigs: {},
      metadata: { createdAt: "now", updatedAt: "now" },
    };

    await service.saveAgent(agent1);
    const agents = await service.getAgents();

    assert.strictEqual(agents.length, 1);
    assert.strictEqual(agents[0].id, "1");
    assert.strictEqual(agents[0].name, "Test Agent");
  });
});
