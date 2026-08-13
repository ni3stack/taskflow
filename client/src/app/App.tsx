import { useRoutes } from "react-router-dom";
import routes from "./routes";

import "../styles/App.css";
import "../styles/buttons.css";

function App() {
  return (
    <div className="app-container">
      {useRoutes(routes)}
    </div>
  )
}

export default App
