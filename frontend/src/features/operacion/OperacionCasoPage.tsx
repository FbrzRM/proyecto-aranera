import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { formatoFecha, formatoFechaHora } from "../../lib/format";
import { useSession } from "../auth/session";
import { EstadoBadge } from "../casos/components/EstadoBadge";
import {
  useAgregarEvidencia,
  useAsignarCaso,
  useCambiarEstado,
  useCaso,
  useEvidencias,
  useSeguimientos
} from "../casos/hooks";
import { puedeCancelar, puedeTomar, rutaDe, siguientesEstados } from "../casos/lifecycle";

const evidenciaSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  url: z.string().url("URL inválida"),
  descripcion: z.string().optional()
});

type EvidenciaInput = z.infer<typeof evidenciaSchema>;

export function OperacionCasoPage() {
  const { id = "" } = useParams();
  const miId = useSession((s) => s.usuario?.id) ?? "";
  const { data: caso, isLoading, isError } = useCaso(id);
  const { data: seguimientos } = useSeguimientos(id);
  const { data: evidencias } = useEvidencias(id);
  const asignar = useAsignarCaso(id);
  const cambiar = useCambiarEstado(id);
  const agregar = useAgregarEvidencia(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EvidenciaInput>({ resolver: zodResolver(evidenciaSchema) });

  if (isLoading) {
    return <p className="text-slate-500">Cargando...</p>;
  }
  if (isError || !caso) {
    return <p className="text-red-600">No se pudo cargar el caso.</p>;
  }

  const ruta = rutaDe(caso.tipo);
  const indiceActual = ruta.indexOf(caso.estado);
  const siguientes = siguientesEstados(caso.estado);

  const onEvidencia = (values: EvidenciaInput) => {
    agregar.mutate(values, { onSuccess: () => reset() });
  };

  return (
    <div className="space-y-6">
      <Link to="/bandeja" className="text-sm text-slate-500 hover:text-slate-800">
        &larr; Volver a la bandeja
      </Link>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
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
            Responsable:{" "}
            <span className="font-medium">
              {caso.responsableId === null ? "Sin asignar" : caso.responsableId === miId ? "Tú" : "Otro empleado"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ruta.map((estado, i) => (
            <span key={estado} className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                  i < indiceActual
                    ? "bg-green-100 text-green-700"
                    : i === indiceActual
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {estado}
              </span>
              {i < ruta.length - 1 && <span className="text-slate-300">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Acciones</h3>
        <div className="flex flex-wrap gap-2">
          {puedeTomar(caso.estado) && caso.responsableId !== miId && (
            <button
              onClick={() => asignar.mutate(miId)}
              disabled={asignar.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              Tomar caso
            </button>
          )}
          {siguientes.map((estado) => (
            <button
              key={estado}
              onClick={() => cambiar.mutate(estado)}
              disabled={cambiar.isPending}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold capitalize text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Marcar: {estado}
            </button>
          ))}
          {puedeCancelar(caso.estado) && (
            <button
              onClick={() => cambiar.mutate("cancelado")}
              disabled={cambiar.isPending}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Cancelar caso
            </button>
          )}
        </div>
        {cambiar.isError && <p className="text-sm text-red-600">No se pudo cambiar el estado.</p>}
        {asignar.isError && <p className="text-sm text-red-600">No se pudo tomar el caso.</p>}
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

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Evidencias</h3>
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

          <form onSubmit={handleSubmit(onEvidencia)} className="space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Adjuntar evidencia</p>
            <input
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              {...register("nombre")}
            />
            {errors.nombre && <p className="text-xs text-red-600">{errors.nombre.message}</p>}
            <input
              placeholder="URL"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              {...register("url")}
            />
            {errors.url && <p className="text-xs text-red-600">{errors.url.message}</p>}
            <input
              placeholder="Descripción (opcional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              {...register("descripcion")}
            />
            <button
              type="submit"
              disabled={agregar.isPending}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {agregar.isPending ? "Guardando..." : "Adjuntar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
