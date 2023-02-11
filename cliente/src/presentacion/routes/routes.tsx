import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "../views/Home";
import RouteNames from "./names.route";
import PrivateWrapper from "./private.route";

const router = createBrowserRouter([
  {
    // TODO: parameterize the [isAuthenticated] param
    element: <PrivateWrapper isAuthenticated={true} />,
    children: [
      {
        path: RouteNames.HOME,
        element: <HomeScreen />,
      },
      {
        path: '/',
        element: <HomeScreen />,
      },
    ],
  }
])

export default router;
