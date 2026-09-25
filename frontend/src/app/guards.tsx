import { Navigate, Outlet } from "react-router-dom";
import { Role, useSession } from "../features/auth/session";

export function RutaProtegida() {
  const token = useSession((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RutaPorRol({ roles }: { roles: Role[] }) {
  const usuario = useSession((s) => s.usuario);
  if (!usuario || !roles.includes(usuario.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
