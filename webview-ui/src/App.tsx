import { useState } from "react";
// import { vscode } from "./api/vscode";
import "./app.css";
import { AgentEditor } from "./components/agent-editor";
import { AgentList } from "./components/agent-list";
import type { SubAgent } from "./models/types";

function App() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);

  const handleCreate = () => {
    setSelectedAgent(null);
    setView("editor");
  };

  const handleEdit = (agent: SubAgent) => {
    setSelectedAgent(agent);
    setView("editor");
  };

  const handleSave = () => {
    setView("list");
    setSelectedAgent(null);
  };

  const handleCancel = () => {
    setView("list");
    setSelectedAgent(null);
  };

  return (
    <div className="App">
      <h1>SubAgent Manager</h1>
      <main>
        {view === "list" ? (
          <AgentList onCreate={handleCreate} onEdit={handleEdit} />
        ) : (
          <AgentEditor
            initialAgent={selectedAgent}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
}

export default App;
