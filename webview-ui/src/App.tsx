import { useState } from "react";
import { vscode } from "./api/vscode";
import "./app.css";

function App() {
  const [count, setCount] = useState(0);

  const handleNotify = () => {
    vscode.postMessage({
      command: "hello",
      payload: { text: `Count is ${count}` },
    });
  };

  return (
    <div className="App">
      <h1>SubAgent Manager</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)} type="button">
          count is {count}
        </button>
        <button
          onClick={handleNotify}
          style={{ marginLeft: "1rem" }}
          type="button"
        >
          Notify Extension
        </button>
      </div>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}

export default App;
