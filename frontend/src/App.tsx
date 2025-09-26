import React, { useState, useEffect } from 'react';
import './App.css';
import { getHealth } from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend status...');

  useEffect(() => {
    getHealth()
      .then(response => {
        setBackendStatus(`Backend: ${response.data.message}`);
      })
      .catch(error => {
        setBackendStatus('Backend: Error connecting to server');
        console.error('Error fetching health check:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚘 AI Car Life Manager</h1>
        <p>{backendStatus}</p>
      </header>
    </div>
  );
}

export default App;