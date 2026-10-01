import { Fragment, useMemo, useState } from "react";
import { CampoBusqueda } from "../../components/CampoBusqueda";
import { EditarTerceroForm } from "./EditarTerceroForm";
import { TerceroCreado } from "./terceros.api";
import { useCrearTercero, useTerceros } from "./terceros.hooks";

export function TercerosPage() {
  const [nombre, setNombre] = useState("");
  const [credencial, setCredencial] = useState<TerceroCreado | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const { data, isLoading, isError } = useTerceros();
  const crear = useCrearTercero();

  const tercerosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (data?.items ?? []).filter((tercero) => {
      const coincideTexto =
        !texto || tercero.nombre.toLowerCase().includes(texto) || tercero.clientId.toLowerCase().includes(texto);
      const coincideEstado =
        estadoFiltro === "todos" ||
        (estadoFiltro === "activos" && tercero.activo) ||
        (estadoFiltro === "inactivos" && !tercero.activo);
      return coincideTexto && coincideEstado;
    });
  }, [data, busqueda, estadoFiltro]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nombre.trim()) {
      return;
    }
    crear.mutate(nombre.trim(), {
      onSuccess: (tercero) => {
        setCredencial(tercero);
        setNombre("");
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Terceros</h2>

      <form onSubmit={onSubmit} className="flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="nombre">
            Nombre de la empresa
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={crear.isPending}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {crear.isPending ? "Creando..." : "Registrar tercero"}
        </button>
      </form>

      {crear.isError && <p className="text-sm text-red-600">No se pudo registrar el tercero.</p>}

      {credencial && (
        <div className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-800">
            Guarda estas credenciales ahora: el secreto no se vuelve a mostrar.
          </p>
          <div className="grid grid-cols-1 gap-1 text-sm text-slate-700">
            <span>
              <span className="font-medium">clientId:</span>{" "}
              <code className="rounded bg-white px-1 py-0.5">{credencial.clientId}</code>
            </span>
            <span>
              <span className="font-medium">clientSecret:</span>{" "}
              <code className="rounded bg-white px-1 py-0.5">{credencial.clientSecret}</code>
            </span>
          </div>
          <button
            onClick={() => setCredencial(null)}
            className="text-sm text-amber-800 underline hover:text-amber-900"
          >
            Entendido, ocultar
          </button>
        </div>
      )}

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      {isError && <p className="text-red-600">No se pudieron cargar los terceros.</p>}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aún no hay terceros registrados.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <CampoBusqueda value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o clientId..." />
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

      {data && data.items.length > 0 && tercerosFiltrados.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Ningún tercero coincide con los filtros.
        </div>
      )}

      {tercerosFiltrados.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">clientId</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tercerosFiltrados.map((tercero) => (
                <Fragment key={tercero.id}>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{tercero.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <code>{tercero.clientId}</code>
                    </td>
                    <td className="px-4 py-3">
                      {tercero.activo ? (
                        <span className="text-emerald-600">Activo</span>
                      ) : (
                        <span className="text-slate-400">Inactivo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditId((id) => (id === tercero.id ? null : tercero.id))}
                        aria-label={editId === tercero.id ? "Cerrar edición" : "Editar tercero"}
                        title={editId === tercero.id ? "Cerrar" : "Editar"}
                        className="inline-flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        {editId === tercero.id ? (
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
                  {editId === tercero.id && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={4} className="p-0">
                        <EditarTerceroForm tercero={tercero} onDone={() => setEditId(null)} />
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
