import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavigateLoginRoute() {
  const { user, token } = useAuth();
  const location = useLocation();
  const isAuthenticated = Boolean(user && token);
  if (isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default NavigateLoginRoute;
