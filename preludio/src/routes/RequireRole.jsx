import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/authHook.js";

export default function RequireRole({ roles = [] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={`/login?returnTo=${encodeURIComponent("/administration")}`} replace />;
  if (!roles.includes(user.rol)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
