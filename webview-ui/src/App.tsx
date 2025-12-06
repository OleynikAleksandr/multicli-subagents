import { useState } from 'react';
import { vscode } from './api/vscode';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const handleNotify = () => {
    vscode.postMessage({
      command: 'hello',
      payload: { text: `Count is ${count}` },
    });
  };

  return (
    <div className="App">
      <h1>SubAgent Manager</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleNotify} style={{ marginLeft: '1rem' }}>
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
