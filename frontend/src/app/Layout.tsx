import { Link, Outlet, useNavigate } from "react-router-dom";
import { Role, useSession } from "../features/auth/session";

const enlacesPorRol: Record<Role, { to: string; label: string }[]> = {
  administrador: [
    { to: "/usuarios", label: "Usuarios" },
    { to: "/terceros", label: "Terceros" }
  ],
  jefatura: [{ to: "/dashboard", label: "Dashboard" }],
  empleado: [{ to: "/bandeja", label: "Bandeja" }],
  cliente: [{ to: "/casos", label: "Mis casos" }],
  tercero: []
};

export function Layout() {
  const usuario = useSession((s) => s.usuario);
  const cerrarSesion = useSession((s) => s.cerrarSesion);
  const navigate = useNavigate();

  if (!usuario) {
    return null;
  }

  const salir = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <img src="/logo-araneda.svg" alt="Araneda" className="h-8 w-8 rounded" />
            <span>Araneda</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            {enlacesPorRol[usuario.role].map((enlace) => (
              <Link key={enlace.to} to={enlace.to} className="text-slate-600 hover:text-slate-900">
                {enlace.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">
            {usuario.nombre} ({usuario.role})
          </span>
          <button
            onClick={salir}
            className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-50"
          >
            Salir
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
