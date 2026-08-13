import { Navigate, type RouteObject } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import TasksPage from "../features/tasks/pages/TasksPage";
import SignupPage from "../features/auth/pages/SignupPage";

const routes: RouteObject[] = [
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignupPage />
    },

    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: "tasks",
                element: <TasksPage />
            }
        ]
    },
    {
        path:"/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
];

export default routes;