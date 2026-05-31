import { createBrowserRouter } from "react-router-dom";
import {
  PublicRoute,
  PrivateRoute,
  SdmRoute,
  UserRoute,
} from "./lib/RouteGuard";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { SdmDashboard } from "./pages/SdmDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { UserLayout } from "./components/layout/UserLayout";
import { SdmLayout } from "./components/layout/SdmLayout";
import PerdinList from "./pages/user/perdinku";

export const routes = createBrowserRouter([
  {
    Component: PublicRoute,
    children: [{ path: "login", Component: LoginPage }],
  },
  {
    Component: PrivateRoute,
    children: [
      {
        Component: SdmRoute,
        children: [
          {
            path: "sdm/dashboard",
            Component: SdmLayout,
            children: [{ index: true, Component: SdmDashboard }],
          },
        ],
      },
    ],
  },
  {
    Component: PrivateRoute,
    children: [
      {
        Component: UserRoute,
        children: [
          {
            path: "user/dashboard",
            Component: UserLayout,
            children: [{ index: true, Component: PerdinList }],
          },
        ],
      },
    ],
  },
  { path: "*", Component: NotFound },
]);
