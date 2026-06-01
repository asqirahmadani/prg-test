import { createBrowserRouter } from "react-router-dom";
import {
  PublicRoute,
  PrivateRoute,
  SdmRoute,
  UserRoute,
} from "./lib/RouteGuard";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { UserLayout } from "./components/layout/UserLayout";
import { SdmLayout } from "./components/layout/SdmLayout";
import UserPerdinList from "./pages/user/perdinku";
import SdmPerdinList from "./pages/sdm/perdin";
import CityList from "./pages/sdm/city";

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
            children: [
              { index: true, Component: SdmPerdinList },
              { path: "kota", Component: CityList },
            ],
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
            children: [{ index: true, Component: UserPerdinList }],
          },
        ],
      },
    ],
  },
  { path: "*", Component: NotFound },
]);
