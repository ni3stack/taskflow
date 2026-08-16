import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hook";
import routes from "./routes";

import "../styles/App.css";
import "../styles/buttons.css";
import { initializingAuth, setCredentials } from "../features/auth/authSlice";
import { getCurrentUser } from "../features/auth/api/authApi";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("accessToken");
      if(!token) {
        dispatch(initializingAuth());
        return;
      }
      try {
        const currentUser = await getCurrentUser(token);
        dispatch(setCredentials({
          token,
          user: currentUser.user
        }))
      } catch {
        sessionStorage.removeItem("accessToken");
        dispatch(initializingAuth());
      }
    };
    restoreSession();
  },[dispatch]);
  return (
    <div className="app-container">
      {useRoutes(routes)}
    </div>
  )
}

export default App
