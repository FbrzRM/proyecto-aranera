import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CampoBusqueda } from "../../components/CampoBusqueda";
import { formatoFecha } from "../../lib/format";
import { EstadoBadge } from "./components/EstadoBadge";
import { useCasos } from "./hooks";

const tipos = ["pedido", "reclamo", "requerimiento"];
const estados = ["creado", "recibido", "asignado", "despachando", "empacando", "pagado", "enviado", "cerrado", "cancelado"];

export function CasosPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCasos();
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const casosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (data?.items ?? []).filter((caso) => {
      const coincideTexto =
        !texto || caso.titulo.toLowerCase().includes(texto) || caso.descripcion.toLowerCase().includes(texto);
      const coincideTipo = tipoFiltro === "todos" || caso.tipo === tipoFiltro;
      const coincideEstado = estadoFiltro === "todos" || caso.estado === estadoFiltro;
      return coincideTexto && coincideTipo && coincideEstado;
    });
  }, [data, busqueda, tipoFiltro, estadoFiltro]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Mis casos</h2>
        <Link
          to="/casos/nuevo"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Nuevo caso
        </Link>
      </div>

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <CampoBusqueda value={busqueda} onChange={setBusqueda} placeholder="Buscar por título o descripción..." />
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
          >
            <option value="todos">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
          <select
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
          >
            <option value="todos">Todos los estados</option>
            {estados.map((e) => (
              <option key={e} value={e} className="capitalize">
                {e}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      {isError && <p className="text-red-600">No se pudieron cargar los casos.</p>}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aún no tienes casos. Crea el primero con "Nuevo caso".
        </div>
      )}

      {data && data.items.length > 0 && casosFiltrados.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Ningún caso coincide con los filtros.
        </div>
      )}

      {casosFiltrados.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Plazo</th>
                <th className="px-4 py-3 font-medium">Pago</th>
              </tr>
            </thead>
            <tbody>
              {casosFiltrados.map((caso) => (
                <tr
                  key={caso.id}
                  onClick={() => navigate(`/casos/${caso.id}`)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{caso.titulo}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{caso.tipo}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{caso.categoria}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={caso.estado} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatoFecha(caso.plazo)}</td>
                  <td className="px-4 py-3">
                    {caso.pagado ? (
                      <span className="text-emerald-600">Pagado</span>
                    ) : (
                      <span className="text-slate-400">Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
