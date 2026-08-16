import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/dashboard">Dashboard</NavLink>
                <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/dashboard/tasks">Tasks</NavLink>
                <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/dashboard/projects">Projects</NavLink>
                <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/dashboard/profile">Profile</NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;