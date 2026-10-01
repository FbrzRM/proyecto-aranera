import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CampoBusqueda } from "../../components/CampoBusqueda";
import { useCrearUsuario, useUsuarios } from "./usuarios.hooks";
import { EditarUsuarioForm } from "./EditarUsuarioForm";
import { CrearUsuarioInput, crearUsuarioSchema } from "./usuarios.schema";

const roles: CrearUsuarioInput["role"][] = ["administrador", "jefatura", "empleado", "cliente"];

export function UsuariosPage() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const { data, isLoading, isError } = useUsuarios();

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (data?.items ?? []).filter((usuario) => {
      const coincideTexto =
        !texto || usuario.nombre.toLowerCase().includes(texto) || usuario.email.toLowerCase().includes(texto);
      const coincideRol = rolFiltro === "todos" || usuario.role === rolFiltro;
      const coincideEstado =
        estadoFiltro === "todos" ||
        (estadoFiltro === "activos" && usuario.activo) ||
        (estadoFiltro === "inactivos" && !usuario.activo);
      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [data, busqueda, rolFiltro, estadoFiltro]);
  const crear = useCrearUsuario();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CrearUsuarioInput>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: { nombre: "", email: "", password: "", role: "empleado" }
  });

  const onSubmit = (values: CrearUsuarioInput) => {
    crear.mutate(values, {
      onSuccess: () => {
        reset();
        setMostrarForm(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Usuarios</h2>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {mostrarForm ? "Cerrar" : "Nuevo usuario"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                {...register("nombre")}
              />
              {errors.nombre && <p className="text-xs text-red-600">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Correo
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="role">
                Rol
              </label>
              <select
                id="role"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
                {...register("role")}
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {crear.isError && <p className="text-sm text-red-600">No se pudo crear el usuario.</p>}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={crear.isPending}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {crear.isPending ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <CampoBusqueda value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o correo..." />
          <select
            value={rolFiltro}
            onChange={(event) => setRolFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
          >
            <option value="todos">Todos los roles</option>
            {roles.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </select>
          <select
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
      )}

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      {isError && <p className="text-red-600">No se pudieron cargar los usuarios.</p>}

      {data && data.items.length > 0 && usuariosFiltrados.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Ningún usuario coincide con los filtros.
        </div>
      )}

      {usuariosFiltrados.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <Fragment key={usuario.id}>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{usuario.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{usuario.email}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{usuario.role}</td>
                    <td className="px-4 py-3">
                      {usuario.activo ? (
                        <span className="text-emerald-600">Activo</span>
                      ) : (
                        <span className="text-slate-400">Inactivo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditId((id) => (id === usuario.id ? null : usuario.id))}
                        aria-label={editId === usuario.id ? "Cerrar edición" : "Editar usuario"}
                        title={editId === usuario.id ? "Cerrar" : "Editar"}
                        className="inline-flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        {editId === usuario.id ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                  {editId === usuario.id && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={5} className="p-0">
                        <EditarUsuarioForm usuario={usuario} onDone={() => setEditId(null)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
