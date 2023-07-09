/**
 * En esta seccion se define un componente para proteger ciertas rutas a 
* las cuales el usuario solo puede acceder si esta autenticado
 */
import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  /** Indica si el usuario esta autenticado */
  isAuthenticated: boolean | null;
}

/**
 * Wrapper que solo permite acceder a las rutas protegidas si el usuario esta autenticado
* @param isAuthenticated {boolean} - Indica si el usuario esta autenticado
 */
const PublicRouteWrapper = ({
  isAuthenticated,
}: PublicRouteProps) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" />;
}

export default PublicRouteWrapper;
