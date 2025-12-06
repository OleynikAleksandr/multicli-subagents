import { useState } from "react";
import { vscode } from "../api/vscode";
import type { SubAgent, SubAgentVendor } from "../models/types";

type AgentEditorProps = {
  initialAgent?: SubAgent | null;
  onSave: () => void;
  onCancel: () => void;
};

/**
 * Generate CLI commands based on agent name and vendor
 */
const generateCommands = (
  name: string,
  vendor: SubAgentVendor
): { start: string; resume: string } => {
  if (vendor === "codex") {
    return {
      start: `cd "$CWD" && codex exec --skip-git-repo-check --full-auto "First, read .subagents/${name}/${name}.md. Then: $TASK"`,
      resume: `cd "$CWD" && codex exec resume $SESSION_ID "$ANSWER"`,
    };
  }
  // claude
  return {
    start: `cd "$CWD" && claude -p "First, read .subagents/${name}/${name}.md. Then: $TASK" --dangerously-skip-permissions`,
    resume: `cd "$CWD" && claude --continue "$ANSWER" --dangerously-skip-permissions`,
  };
};

export const AgentEditor = ({
  initialAgent,
  onSave,
  onCancel,
}: AgentEditorProps) => {
  const [name, setName] = useState(initialAgent?.name || "");
  const [description, setDescription] = useState(
    initialAgent?.description || ""
  );
  const [vendor, setVendor] = useState<SubAgentVendor>(
    initialAgent?.vendor || "codex"
  );
  const [instructions, setInstructions] = useState(
    initialAgent?.instructions || ""
  );

  const commands = generateCommands(name, vendor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const agentPayload: SubAgent = {
      id: initialAgent?.id || crypto.randomUUID(),
      name,
      description,
      vendor,
      instructions,
      commands,
      metadata: initialAgent?.metadata || {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vscode.postMessage({
      command: initialAgent ? "agent.update" : "agent.create",
      payload: agentPayload,
    });

    onSave();
  };

  const buildPayload = (): SubAgent => ({
    id: initialAgent?.id || crypto.randomUUID(),
    name,
    description,
    vendor,
    instructions,
    commands,
    metadata: initialAgent?.metadata || {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

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
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            value={name}
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-sm"
            htmlFor="description"
          >
            Description (include keywords for routing)
          </label>
          <input
            className="w-full rounded border border-gray-600 bg-transparent p-2"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Translates text. Use for: translate, переведи, перевод"
            type="text"
            value={description}
          />
        </div>

        <div>
          <span className="mb-1 block font-medium text-sm">
            Sub Agent Vendor
          </span>
          <div className="flex gap-4">
            {(["codex", "claude"] as SubAgentVendor[]).map((v) => (
              <label className="flex items-center gap-2" key={v}>
                <input
                  checked={vendor === v}
                  name="vendor"
                  onChange={() => setVendor(v)}
                  type="radio"
                />
                {v === "codex" ? "Codex CLI" : "Claude Code CLI"}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs opacity-60">
            CLI that will execute this Sub Agent
          </p>
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
            onChange={(e) => setInstructions(e.target.value)}
            value={instructions}
          />
        </div>

        {!!name && (
          <div>
            <span className="mb-1 block font-medium text-sm">
              Generated Commands (read-only)
            </span>
            <div className="rounded border border-gray-700 bg-gray-900 p-2 font-mono text-xs">
              <div className="mb-1">
                <span className="text-green-400">start:</span> {commands.start}
              </div>
              <div>
                <span className="text-blue-400">resume:</span> {commands.resume}
              </div>
            </div>
          </div>
        )}

        {!!initialAgent && (
          <div className="mt-4 border-gray-700 border-t pt-4">
            <h3 className="mb-2 font-bold text-sm">Deployment</h3>
            <div className="flex gap-2">
              <button
                className="rounded bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-600"
                onClick={() => {
                  vscode.postMessage({
                    command: "agent.deploy.project",
                    payload: buildPayload(),
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
                    payload: buildPayload(),
                  });
                }}
                type="button"
              >
                Deploy Global
              </button>
              <button
                className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-500"
                onClick={() => {
                  vscode.postMessage({
                    command: "agent.export",
                    payload: buildPayload(),
                  });
                }}
                type="button"
              >
                Export
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
