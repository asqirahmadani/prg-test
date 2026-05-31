import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { ROLE_ROUTES } from "./constants";

export function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    const path = ROLE_ROUTES[user.role] || "/dashboard";
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
}

export function PrivateRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const path = ROLE_ROUTES[user.role] || "/dashboard";
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
}

export const SdmRoute = () => <PrivateRoute allowedRoles={["sdm"]} />;

export const UserRoute = () => <PrivateRoute allowedRoles={["user"]} />;
