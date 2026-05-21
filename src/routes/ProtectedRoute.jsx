import { Navigate, Outlet } from "react-router-dom";
import { getStoredToken } from "../utils/api";

const ProtectedRoute = () => {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
