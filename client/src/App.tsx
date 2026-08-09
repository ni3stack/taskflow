import { useState, useEffect } from "react";
import "./App.css"

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
  },[]);

  return (
    <div className="app-container">
      <h2>Task flow application coming soon</h2>
      <p>{message}</p>
    </div>
  )
}

export default App
