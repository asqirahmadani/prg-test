import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return !user ? <Outlet /> : <Navigate to="/" replace />;
}
