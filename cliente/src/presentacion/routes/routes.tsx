import { createBrowserRouter } from "react-router-dom";
import SignIn from "../views/autenticacion/login";
import SignUp from "../views/autenticacion/registro";
import HomeScreen from "../views/Home";
import RouteNames from "./names.route";
import PrivateWrapper from "./private.route";
import PublicRouteWrapper from "./public.route";

const router = createBrowserRouter([
  {
    // TODO: parameterize the [isAuthenticated] param
    element: <PrivateWrapper isAuthenticated={false} />,
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
  },
  {
    element: <PublicRouteWrapper isAuthenticated={false} />,
    children: [
      {
        path: RouteNames.LOGIN,
        element: <SignIn />,
      },
      {
        path: RouteNames.REGISTER,
        element: <SignUp />,
      }
    ],
  }
])

export default router;
