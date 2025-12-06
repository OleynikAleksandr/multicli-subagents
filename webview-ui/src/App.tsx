// import { useState } from "react";
// import { vscode } from "./api/vscode";
import "./app.css";
import { AgentList } from "./components/agent-list";

function App() {
  // const [count, setCount] = useState(0);

  // const handleNotify = () => {
  // vscode.postMessage({
  // command: "hello",
  // payload: { text: `Count is ${count}` },
  // });
  // };

  return (
    <div className="App">
      <h1>SubAgent Manager</h1>
      <main>
        <AgentList />
      </main>
    </div>
  );
}

export default App;
