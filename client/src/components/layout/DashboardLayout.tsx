import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./layout.css"

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Header />
            <div className="dashboard-body">
                <Sidebar />
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;