import { RouteObject } from "react-router-dom";
import { Home } from "./home";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
];
