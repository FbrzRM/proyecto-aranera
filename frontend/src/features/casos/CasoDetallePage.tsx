import { Link, useParams } from "react-router-dom";
import { formatoFecha, formatoFechaHora } from "../../lib/format";
import { EstadoBadge } from "./components/EstadoBadge";
import { useCaso, useEvidencias, usePagarCaso, useSeguimientos } from "./hooks";

export function CasoDetallePage() {
  const { id = "" } = useParams();
  const { data: caso, isLoading, isError } = useCaso(id);
  const { data: seguimientos } = useSeguimientos(id);
  const { data: evidencias } = useEvidencias(id);
  const pagar = usePagarCaso(id);

  if (isLoading) {
    return <p className="text-slate-500">Cargando...</p>;
  }
  if (isError || !caso) {
    return <p className="text-red-600">No se pudo cargar el caso.</p>;
  }

  const puedePagar = !caso.pagado && caso.estado !== "cerrado" && caso.estado !== "cancelado";

  return (
    <div className="space-y-6">
      <Link to="/casos" className="text-sm text-slate-500 hover:text-slate-800">
        &larr; Volver a mis casos
      </Link>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{caso.titulo}</h2>
            <p className="mt-1 text-sm capitalize text-slate-500">
              {caso.tipo} · {caso.categoria}
            </p>
          </div>
          <EstadoBadge estado={caso.estado} />
        </div>

        <p className="text-sm text-slate-600">{caso.descripcion}</p>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">
          <span>
            Plazo: <span className="font-medium">{formatoFecha(caso.plazo)}</span>
          </span>
          <span>
            Pago:{" "}
            {caso.pagado ? (
              <span className="font-medium text-emerald-600">Pagado</span>
            ) : (
              <span className="font-medium text-slate-400">Pendiente</span>
            )}
          </span>
        </div>

        {puedePagar && (
          <div>
            <button
              onClick={() => pagar.mutate()}
              disabled={pagar.isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {pagar.isPending ? "Registrando..." : "Registrar pago"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Seguimiento</h3>
          {seguimientos && seguimientos.items.length > 0 ? (
            <ol className="space-y-4">
              {seguimientos.items.map((s) => (
                <li key={s.id} className="relative border-l-2 border-slate-200 pl-4">
                  <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-400" />
                  <p className="text-sm text-slate-700">{s.descripcion}</p>
                  <p className="text-xs text-slate-400">{formatoFechaHora(s.creadoEn)}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">Sin movimientos aún.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Evidencias</h3>
          {evidencias && evidencias.items.length > 0 ? (
            <ul className="space-y-2">
              {evidencias.items.map((e) => (
                <li key={e.id} className="text-sm">
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-700 underline hover:text-slate-900"
                  >
                    {e.nombre}
                  </a>
                  {e.descripcion && <span className="text-slate-500"> — {e.descripcion}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Sin evidencias aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
