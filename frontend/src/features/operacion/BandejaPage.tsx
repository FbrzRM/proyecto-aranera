import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../auth/session";
import { Caso } from "../casos/api";
import { EstadoBadge } from "../casos/components/EstadoBadge";
import { useCasosFiltrados } from "../casos/hooks";
import { formatoFecha } from "../../lib/format";

type Filtro = "todos" | "mios" | "sinAsignar" | "vencidos";

const filtros: { clave: Filtro; label: string }[] = [
  { clave: "todos", label: "Todos" },
  { clave: "mios", label: "Asignados a mí" },
  { clave: "sinAsignar", label: "Sin asignar" },
  { clave: "vencidos", label: "Vencidos" }
];

function estaVencido(caso: Caso): boolean {
  return new Date(caso.plazo).getTime() < Date.now() && caso.estado !== "cerrado" && caso.estado !== "cancelado";
}

export function BandejaPage() {
  const navigate = useNavigate();
  const miId = useSession((s) => s.usuario?.id);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const { data, isLoading, isError } = useCasosFiltrados({});

  const casos = (data?.items ?? []).filter((caso) => {
    if (filtro === "mios") return caso.responsableId === miId;
    if (filtro === "sinAsignar") return caso.responsableId === null;
    if (filtro === "vencidos") return estaVencido(caso);
    return true;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Bandeja de casos</h2>

      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.clave}
            onClick={() => setFiltro(f.clave)}
            className={`rounded-full px-3 py-1 text-sm ${
              filtro === f.clave ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      {isError && <p className="text-red-600">No se pudieron cargar los casos.</p>}

      {!isLoading && casos.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No hay casos en esta vista.
        </div>
      )}

      {casos.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Responsable</th>
                <th className="px-4 py-3 font-medium">Plazo</th>
              </tr>
            </thead>
            <tbody>
              {casos.map((caso) => (
                <tr
                  key={caso.id}
                  onClick={() => navigate(`/bandeja/${caso.id}`)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{caso.titulo}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{caso.tipo}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={caso.estado} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {caso.responsableId === null
                      ? "Sin asignar"
                      : caso.responsableId === miId
                        ? "Tú"
                        : "Otro empleado"}
                  </td>
                  <td className={`px-4 py-3 ${estaVencido(caso) ? "font-semibold text-red-600" : "text-slate-600"}`}>
                    {formatoFecha(caso.plazo)}
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
