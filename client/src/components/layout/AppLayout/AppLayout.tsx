import { Outlet } from "react-router-dom";
import AppNavbar from "../AppNavbar/AppNavbar";
import AppHeader from "../AppHeader/AppHeader";
import "./layout.css"

function AppLayout() {
  return (
    <div className="app-layout">
      <AppNavbar />
      <div className="app-shell">
        <AppHeader />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;