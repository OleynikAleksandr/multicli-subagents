import { useEffect, useState } from "react";
import { vscode } from "../api/vscode";
import type { SubAgent } from "../models/types";

type AgentListProps = {
  onCreate: () => void;
  onEdit: (agent: SubAgent) => void;
};

/**
 * Browse Screen - List of all agents with actions
 */
export const AgentList = ({ onCreate, onEdit }: AgentListProps) => {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployTarget, setDeployTarget] = useState<{
    agent: SubAgent;
    target: "project" | "global" | null;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<SubAgent | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === "agent.list.result") {
        setAgents(message.payload as SubAgent[]);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "agent.list" });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleDeploy = (agent: SubAgent, target: "project" | "global") => {
    vscode.postMessage({
      command:
        target === "project" ? "agent.deploy.project" : "agent.deploy.global",
      payload: agent,
    });
    setDeployTarget(null);
  };

  const handleExport = (agent: SubAgent) => {
    vscode.postMessage({ command: "agent.export", payload: agent });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      vscode.postMessage({
        command: "agent.delete",
        payload: { id: deleteConfirm.id },
      });
      setAgents(agents.filter((a) => a.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const closeModal = () => {
    setDeployTarget(null);
    setDeleteConfirm(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  if (loading) {
    return <div className="text-center text-muted">Loading agents...</div>;
  }

  return (
    <div className="flex flex-col gap-md">
      {/* Import button */}
      <button
        className="btn-secondary w-full"
        onClick={() => vscode.postMessage({ command: "agent.import" })}
        type="button"
      >
        Import .subagent file
      </button>

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="mt-md text-center text-muted">
          <p>No agents in library yet.</p>
          <button
            className="btn-primary mt-md"
            onClick={onCreate}
            type="button"
          >
            Create your first agent
          </button>
        </div>
      )}

      {/* Agent cards */}
      {agents.map((agent) => (
        <div className="card" key={agent.id}>
          <div className="card-header">
            <div>
              <div className="card-title">{agent.name}</div>
              <div className="card-description">{agent.description}</div>
            </div>
            <span className={`badge badge-${agent.vendor}`}>
              {agent.vendor}
            </span>
          </div>

          <div className="card-actions">
            <button
              className="btn-secondary"
              onClick={() => onEdit(agent)}
              type="button"
            >
              Edit
            </button>
            <button
              className="btn-success"
              onClick={() => setDeployTarget({ agent, target: null })}
              type="button"
            >
              Deploy
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleExport(agent)}
              type="button"
            >
              Export
            </button>
            <button
              className="btn-danger"
              onClick={() => setDeleteConfirm(agent)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Deploy Modal */}
      {!!deployTarget && (
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal overlay pattern
        <div
          aria-label="Deploy modal"
          className="modal-overlay"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
        >
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal content container */}
          <div
            aria-label="Deploy options"
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            <h3 className="modal-title">Deploy "{deployTarget.agent.name}"</h3>

            <div className="flex flex-col gap-md">
              <label className="flex items-center gap-sm">
                <input
                  checked={deployTarget.target === "project"}
                  name="deploy-target"
                  onChange={() =>
                    setDeployTarget({ ...deployTarget, target: "project" })
                  }
                  type="radio"
                />
                <div>
                  <div>Project</div>
                  <div className="form-hint">.subagents/ in workspace</div>
                </div>
              </label>

              <label className="flex items-center gap-sm">
                <input
                  checked={deployTarget.target === "global"}
                  name="deploy-target"
                  onChange={() =>
                    setDeployTarget({ ...deployTarget, target: "global" })
                  }
                  type="radio"
                />
                <div>
                  <div>Global</div>
                  <div className="form-hint">
                    ~/.subagents/ for all projects
                  </div>
                </div>
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!deployTarget.target}
                onClick={() => {
                  if (deployTarget.target) {
                    handleDeploy(deployTarget.agent, deployTarget.target);
                  }
                }}
                type="button"
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {!!deleteConfirm && (
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal overlay pattern
        <div
          aria-label="Delete confirmation"
          className="modal-overlay"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
        >
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal content container */}
          <div
            aria-label="Confirm delete"
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            <h3 className="modal-title">Delete "{deleteConfirm.name}"?</h3>
            <p className="text-muted">This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteConfirm}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
