import { Navigate, type RouteObject } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout/PublicLayout";
import LandingPage from "../features/marketing/pages/LandingPage";

import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import DashboardLayout from "../components/layout/AppLayout/AppLayout";
import TasksPage from "../features/tasks/pages/TasksPage";
import SignupPage from "../features/auth/pages/SignupPage";
import ProtectedRoute from "../features/auth/componenets/ProtectedRoute";
import ProjectPage from "../features/projects/pages/ProjectPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import ResetPassword from "../features/auth/pages/ResetPassword";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import FeaturesPage from "../features/marketing/pages/FeaturesPage";
import PricingPage from "../features/marketing/pages/PricingPage";


const routes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
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
              element:  <TasksPage />
          },
          {
              path: "projects",
              element:  <ProjectPage />
          },
          {
              path: "profile",
              element:  <ProfilePage />
          }
        ]
      },
    ]
  },
  {
      path:"/",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />
        },
        {
          path: "features",
          element: <FeaturesPage />
        },
        {
          path: "pricing",
          element: <PricingPage />
        },
        {
          path: "/login",
          element: <LoginPage />
        },
        {
          path: "/signup",
          element: <SignupPage />
        },

        {
          path: "/reset-password",
          element: <ResetPassword />
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />
        },
      ]
  },
  {
      path: "*",
      element: <Navigate to="/login" replace />
  }
];

export default routes;