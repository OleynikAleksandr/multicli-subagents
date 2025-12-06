import { useState } from "react";
import { AgentEditor } from "./components/agent-editor";
import { AgentList } from "./components/agent-list";
import { HomeScreen } from "./components/home-screen";
import type { SubAgent } from "./models/types";

/**
 * Screen types for routing
 */
type Screen = "home" | "create" | "browse" | "edit";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);

  const goHome = () => {
    setScreen("home");
    setSelectedAgent(null);
  };

  const handleCreate = () => {
    setSelectedAgent(null);
    setScreen("create");
  };

  const handleBrowse = () => {
    setScreen("browse");
  };

  const handleEdit = (agent: SubAgent) => {
    setSelectedAgent(agent);
    setScreen("edit");
  };

  const handleSave = () => {
    setScreen("browse");
    setSelectedAgent(null);
  };

  return (
    <>
      {screen === "home" && (
        <HomeScreen onBrowseClick={handleBrowse} onCreateClick={handleCreate} />
      )}

      {screen === "browse" && (
        <div className="container">
          <div className="header">
            <button
              className="btn-secondary back-button"
              onClick={goHome}
              type="button"
            >
              ← Back
            </button>
            <h2>Browse SubAgents</h2>
          </div>
          <AgentList onCreate={handleCreate} onEdit={handleEdit} />
        </div>
      )}

      {(screen === "create" || screen === "edit") && (
        <div className="container">
          <div className="header">
            <button
              className="btn-secondary back-button"
              onClick={goHome}
              type="button"
            >
              ← Back
            </button>
            <h2>
              {screen === "create" ? "Create New SubAgent" : "Edit SubAgent"}
            </h2>
          </div>
          <AgentEditor
            initialAgent={selectedAgent}
            onCancel={goHome}
            onSave={handleSave}
          />
        </div>
      )}
    </>
  );
}

export default App;
