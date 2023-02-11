/**
 * En esta seccion se define un componente para proteger ciertas rutas a 
* las cuales el usuario solo puede acceder si esta autenticado
 */
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  /** Indica si el usuario esta autenticado */
  isAuthenticated: boolean;
}

/**
 * Wrapper que solo permite acceder a las rutas protegidas si el usuario esta autenticado
* @param isAuthenticated {boolean} - Indica si el usuario esta autenticado
 */
const PrivateWrapper = ({
  isAuthenticated,
}: PrivateRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateWrapper;
