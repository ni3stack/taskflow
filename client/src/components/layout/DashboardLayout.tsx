import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function DashboardLayout() {
    return (
        <div>
            <Header />
            <div>
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;