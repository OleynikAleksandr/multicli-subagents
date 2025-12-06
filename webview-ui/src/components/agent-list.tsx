import { useEffect, useState } from "react";
import { vscode } from "../api/vscode";
import type { SubAgent } from "../models/types";

type AgentListProps = {
  onCreate: () => void;
  onEdit: (agent: SubAgent) => void;
};

export const AgentList = ({ onCreate, onEdit }: AgentListProps) => {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handler for messages from extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === "agent.list.result") {
        setAgents(message.payload as SubAgent[]);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Initial fetch
    vscode.postMessage({ command: "agent.list" });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No agents found.</p>
        <button
          className="config-btn mt-2 rounded bg-blue-600 px-4 py-2 text-white"
          onClick={onCreate}
          type="button"
        >
          Create New Agent
        </button>
        <button
          className="mt-2 ml-2 rounded border border-gray-600 px-4 py-2 text-white hover:bg-white/10"
          onClick={() => vscode.postMessage({ command: "agent.import" })}
          type="button"
        >
          Import
        </button>
      </div>
    );
  }

  return (
    <div className="agent-list p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-lg">Agents</h2>
        <div className="flex gap-2">
          <button
            className="rounded border border-gray-600 px-3 py-1 text-sm text-white hover:bg-white/10"
            onClick={() => vscode.postMessage({ command: "agent.import" })}
            type="button"
          >
            Import
          </button>
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
            onClick={onCreate}
            type="button"
          >
            + New Agent
          </button>
        </div>
      </div>

      {agents.map((agent) => (
        <div
          className="agent-card mb-4 rounded border border-gray-700 bg-gray-800/50 p-3"
          key={agent.id}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{agent.name}</h3>
              <p className="text-sm opacity-80">{agent.description}</p>
            </div>
            <button
              className="rounded border px-2 py-1 text-xs hover:bg-white/10"
              onClick={() => onEdit(agent)}
              type="button"
            >
              Edit
            </button>
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            {agent.supportedProviders.map((p) => (
              <span
                className="rounded border border-blue-800 bg-blue-900/50 px-1 text-blue-200"
                key={p}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
