import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../app/hook";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth
  );

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />
}

export default ProtectedRoute;