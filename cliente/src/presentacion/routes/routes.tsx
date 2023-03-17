import { createBrowserRouter } from "react-router-dom";
import SignIn from "../views/autenticacion/login";
import SignUp from "../views/autenticacion/registro";
import HomeScreen from "../views/Home";
import { ProcessStep } from "../views/process/process_step";
import RouteNames from "./names.route";
import PrivateWrapper from "./private.route";
import PublicRouteWrapper from "./public.route";

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
      {
        path: RouteNames.PROCESS,
        element: <ProcessStep />,
      },
    ],
  },
  {
    element: <PublicRouteWrapper isAuthenticated={true} />,
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
