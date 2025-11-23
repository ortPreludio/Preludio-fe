import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/authHook.js";

export default function RequireAuth() {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) {
    const returnTo = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
