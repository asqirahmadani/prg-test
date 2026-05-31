import { createBrowserRouter } from "react-router-dom";
import { PublicRoute } from "./lib/RouteGuard";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";

export const routes = createBrowserRouter([
  {
    Component: PublicRoute,
    children: [{ path: "login", Component: LoginPage }],
  },
  { path: "*", Component: NotFound },
]);
