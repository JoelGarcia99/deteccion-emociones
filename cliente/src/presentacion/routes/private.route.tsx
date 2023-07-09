/**
 * En esta seccion se define un componente para proteger ciertas rutas a 
* las cuales el usuario solo puede acceder si esta autenticado
 */
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  /** Indica si el usuario esta autenticado */
  isAuthenticated: boolean | null;
}

/**
 * Wrapper que solo permite acceder a las rutas protegidas si el usuario esta autenticado
* @param isAuthenticated {boolean} - Indica si el usuario esta autenticado
 */
const PrivateWrapper = ({
  isAuthenticated,
}: PrivateRouteProps) => {

  console.log("Authenticated wrapper", isAuthenticated);
  if (isAuthenticated === undefined) {
    return <h1>Cargando...</h1>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;

}

export default PrivateWrapper;
