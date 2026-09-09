import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Folder,
  User,
} from "lucide-react";

import "./navbar.css";

function Navbar() {
  return (
    <aside className="app-navbar">
      <div className="app-navbar-brand">
        <Link to="/dashboard">
          <img src="/favicon.svg" alt="" />
          <span className="tf-brand-name">TaskFlow</span>
        </Link>
      </div>
      <nav className="app-navbar-menu">
        <div className="navbar-section">
          <span className="navbar-section-title">Workspace</span>
          <NavLink to="/dashboard" end>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/dashboard/tasks">
            <ListTodo size={18} />
            <span>Tasks</span>
          </NavLink>

          <NavLink to="/dashboard/projects">
            <Folder size={18} />
            <span>Projects</span>
          </NavLink>
        </div>

        <div className="navbar-section">
          <span className="navbar-section-title">Account</span>
          <NavLink to="/dashboard/profile">
            <User size={18} />
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default Navbar;