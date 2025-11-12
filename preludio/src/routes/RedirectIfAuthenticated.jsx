import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export default function RedirectIfAuthenticated() {
  const { user } = useAuth();
  const loc = useLocation();
  const returnTo = new URLSearchParams(loc.search).get("returnTo") || "/";
  if (user) return <Navigate to={returnTo} replace />;
  return <Outlet />;
}