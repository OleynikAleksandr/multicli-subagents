// biome-ignore lint/performance/noNamespaceImport: Test utils
// biome-ignore lint/style/useNodejsImportProtocol: Test utils
import * as assert from "assert";
// biome-ignore lint/performance/noNamespaceImport: VS Code API
import type * as vscode from "vscode";
import { SubAgentService } from "../../core/sub-agent-service";
import type { SubAgent } from "../../models/sub-agent";
import { createMockContext } from "./mock-context";

// biome-ignore lint/correctness/noUndeclaredVariables: Mocha globals
suite("SubAgentService Test Suite", () => {
  let context: vscode.ExtensionContext;

  setup(() => {
    context = createMockContext();
  });

  test("Create and Get Agents", async () => {
    const service = new SubAgentService(context);

    const newAgent: SubAgent = {
      id: "test-id-1",
      name: "New Agent",
      description: "Desc",
      triggers: ["trigger"],
      instructions: "Instr",
      supportedProviders: ["codex"],
      providerConfigs: {},
      metadata: { createdAt: "now", updatedAt: "now" },
    };

    await service.createAgent(newAgent);
    const agents = await service.getAgents();

    assert.strictEqual(agents.length, 1);
    assert.strictEqual(agents[0].name, "New Agent");
    assert.strictEqual(agents[0].id, "test-id-1");
  });

  test("Update Agent", async () => {
    const service = new SubAgentService(context);
    const newAgent: SubAgent = {
      id: "test-id-1",
      name: "Agent 1",
      triggers: [],
      description: "Original",
      instructions: "Instr",
      supportedProviders: [],
      providerConfigs: {},
      metadata: { createdAt: "", updatedAt: "" },
    };
    await service.createAgent(newAgent);
    const agents = await service.getAgents();
    const id = agents[0].id;

    const updatePayload = { ...agents[0], description: "Updated Desc" };
    await service.updateAgent(updatePayload);

    const updatedAgents = await service.getAgents();
    assert.strictEqual(updatedAgents[0].id, id);
    assert.strictEqual(updatedAgents[0].description, "Updated Desc");
  });

  test("Delete Agent", async () => {
    const service = new SubAgentService(context);
    const agentToDelete: SubAgent = {
      id: "del-1",
      name: "To Delete",
      triggers: [],
      description: "",
      instructions: "",
      supportedProviders: [],
      providerConfigs: {},
      metadata: { createdAt: "", updatedAt: "" },
    };
    await service.createAgent(agentToDelete);
    let agents = await service.getAgents();
    assert.strictEqual(agents.length, 1);

    await service.deleteAgent(agents[0].id);
    agents = await service.getAgents();
    assert.strictEqual(agents.length, 0);
  });
});
