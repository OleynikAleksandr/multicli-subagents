import { useEffect, useState } from "react";
import { vscode } from "../api/vscode";
import type { SubAgent } from "../models/types";

export const AgentList = () => {
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
        <button className="config-btn mt-2" type="button">
          Create New Agent
        </button>
      </div>
    );
  }

  return (
    <div className="agent-list p-4">
      {agents.map((agent) => (
        <div className="agent-card mb-4 rounded border p-3" key={agent.id}>
          <h3 className="font-bold">{agent.name}</h3>
          <p className="text-sm opacity-80">{agent.description}</p>
          <div className="mt-2 flex gap-2 text-xs">
            {agent.supportedProviders.map((p) => (
              <span className="rounded bg-blue-100 px-1 text-blue-800" key={p}>
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
