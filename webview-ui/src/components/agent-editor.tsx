import { useState } from "react";
import { vscode } from "../api/vscode";
import type { AgentProviderId, SubAgent } from "../models/types";

type AgentEditorProps = {
  initialAgent?: SubAgent | null;
  onSave: () => void;
  onCancel: () => void;
};

const EMPTY_AGENT: Omit<
  SubAgent,
  "id" | "createdAt" | "updatedAt" | "metadata"
> = {
  name: "",
  description: "",
  triggers: [],
  instructions: "",
  supportedProviders: ["codex"], // Default
  providerConfigs: {},
};

export const AgentEditor = ({
  initialAgent,
  onSave,
  onCancel,
}: AgentEditorProps) => {
  const [formData, setFormData] = useState<Partial<SubAgent>>(
    initialAgent || { ...EMPTY_AGENT }
  );

  const [triggersInput, setTriggersInput] = useState(
    initialAgent?.triggers.join(", ") || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process triggers
    const triggers = triggersInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const agentPayload = {
      ...formData,
      triggers,
      // Ensure required fields for new agents
      id: initialAgent?.id || crypto.randomUUID(), // For now generate ID here or let backend do it. Backend is better but for MVP here is fine.
      metadata: initialAgent?.metadata || {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vscode.postMessage({
      command: initialAgent ? "agent.update" : "agent.create",
      payload: agentPayload,
    });

    // Optimistic update / close
    onSave();
  };

  return (
    <div className="agent-editor p-4">
      <h2 className="mb-4 font-bold text-xl">
        {initialAgent ? "Edit Agent" : "Create New Agent"}
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block font-medium text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="w-full rounded border border-gray-600 bg-transparent p-2"
            id="name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            type="text"
            value={formData.name || ""}
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-sm"
            htmlFor="description"
          >
            Description
          </label>
          <input
            className="w-full rounded border border-gray-600 bg-transparent p-2"
            id="description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            type="text"
            value={formData.description || ""}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium text-sm" htmlFor="triggers">
            Triggers (comma separated)
          </label>
          <input
            className="w-full rounded border border-gray-600 bg-transparent p-2"
            id="triggers"
            onChange={(e) => setTriggersInput(e.target.value)}
            placeholder="e.g. translate, fix-bug"
            type="text"
            value={triggersInput}
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-sm"
            htmlFor="instructions"
          >
            Instructions (System Prompt)
          </label>
          <textarea
            className="h-32 w-full rounded border border-gray-600 bg-transparent p-2 font-mono text-sm"
            id="instructions"
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            value={formData.instructions || ""}
          />
        </div>

        <div>
          <span className="mb-1 block font-medium text-sm">
            Supported Providers
          </span>
          <div className="flex gap-4">
            {["codex", "claude"].map((provider) => (
              <label className="flex items-center gap-2" key={provider}>
                <input
                  checked={formData.supportedProviders?.includes(
                    provider as AgentProviderId
                  )}
                  onChange={(e) => {
                    const current = formData.supportedProviders || [];
                    const next = e.target.checked
                      ? [...current, provider as AgentProviderId]
                      : current.filter((p) => p !== provider);
                    setFormData({ ...formData, supportedProviders: next });
                  }}
                  type="checkbox"
                />
                {provider}
              </label>
            ))}
          </div>
        </div>

        {initialAgent && (
          <div className="mt-4 border-gray-700 border-t pt-4">
            <h3 className="mb-2 font-bold text-sm">Deployment</h3>
            <div className="flex gap-2">
              <button
                className="rounded bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-600"
                onClick={() => {
                  vscode.postMessage({
                    command: "agent.deploy.project",
                    payload: {
                      ...formData,
                      // Ensure full object
                      triggers: (typeof triggersInput === "string"
                        ? triggersInput.split(",")
                        : []
                      )
                        .map((t) => t.trim())
                        .filter(Boolean),
                      id: initialAgent.id,
                      metadata: initialAgent.metadata,
                    },
                  });
                }}
                type="button"
              >
                Deploy to Project
              </button>
              <button
                className="rounded bg-purple-700 px-3 py-1 text-sm text-white hover:bg-purple-600"
                onClick={() => {
                  vscode.postMessage({
                    command: "agent.deploy.global",
                    payload: {
                      ...formData,
                      triggers: (typeof triggersInput === "string"
                        ? triggersInput.split(",")
                        : []
                      )
                        .map((t) => t.trim())
                        .filter(Boolean),
                      id: initialAgent.id,
                      metadata: initialAgent.metadata,
                    },
                  });
                }}
                type="button"
              >
                Deploy Global
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2 border-gray-700 border-t pt-4">
          <button
            className="rounded border border-gray-600 px-4 py-2"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            type="submit"
          >
            Save Agent
          </button>
        </div>
      </form>
    </div>
  );
};
