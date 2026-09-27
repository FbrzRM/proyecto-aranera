import { formatoFecha } from "../../lib/format";
import { EstadoBadge } from "../casos/components/EstadoBadge";
import { BarraDistribucion } from "./components/BarraDistribucion";
import { MetricaCard } from "./components/MetricaCard";
import { useEmpleadosMetricas, useResumen, useVencidos } from "./hooks";

export function DashboardPage() {
  const resumen = useResumen();
  const empleados = useEmpleadosMetricas();
  const vencidos = useVencidos();

  if (resumen.isLoading) {
    return <p className="text-slate-500">Cargando...</p>;
  }
  if (resumen.isError || !resumen.data) {
    return <p className="text-red-600">No se pudo cargar el dashboard.</p>;
  }

  const r = resumen.data;
  const maxEstado = Math.max(1, ...Object.values(r.porEstado));
  const maxTipo = Math.max(1, ...Object.values(r.porTipo));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricaCard titulo="Casos totales" valor={r.total} />
        <MetricaCard
          titulo="Con responsable"
          valor={`${r.porcentajeConResponsable}%`}
          detalle={`${r.conResponsable} de ${r.total}`}
          acento="text-emerald-600"
        />
        <MetricaCard
          titulo="Vencidos"
          valor={r.vencidos}
          detalle={`${r.porcentajeVencidos}% del total`}
          acento="text-red-600"
        />
        <MetricaCard titulo="Pagados" valor={r.pagados} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Casos por estado</h3>
          <div className="space-y-3">
            {Object.entries(r.porEstado).map(([estado, n]) => (
              <BarraDistribucion key={estado} etiqueta={estado} valor={n} max={maxEstado} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Casos por tipo</h3>
          <div className="space-y-3">
            {Object.entries(r.porTipo).map(([tipo, n]) => (
              <BarraDistribucion key={tipo} etiqueta={tipo} valor={n} max={maxTipo} color="bg-indigo-500" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Desempeño por empleado</h3>
        {empleados.data && empleados.data.items.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 font-medium">Empleado</th>
                <th className="py-2 font-medium">Total</th>
                <th className="py-2 font-medium">Abiertos</th>
                <th className="py-2 font-medium">Vencidos</th>
              </tr>
            </thead>
            <tbody>
              {empleados.data.items.map((e) => (
                <tr key={e.responsableId} className="border-t border-slate-100">
                  <td className="py-2 font-medium text-slate-800">{e.nombre}</td>
                  <td className="py-2 text-slate-600">{e.total}</td>
                  <td className="py-2 text-slate-600">{e.abiertos}</td>
                  <td className={`py-2 ${e.vencidos > 0 ? "font-semibold text-red-600" : "text-slate-600"}`}>
                    {e.vencidos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-400">Sin datos.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Casos vencidos</h3>
        {vencidos.data && vencidos.data.items.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 font-medium">Título</th>
                <th className="py-2 font-medium">Estado</th>
                <th className="py-2 font-medium">Plazo</th>
              </tr>
            </thead>
            <tbody>
              {vencidos.data.items.map((caso) => (
                <tr key={caso.id} className="border-t border-slate-100">
                  <td className="py-2 font-medium text-slate-800">{caso.titulo}</td>
                  <td className="py-2">
                    <EstadoBadge estado={caso.estado} />
                  </td>
                  <td className="py-2 font-semibold text-red-600">{formatoFecha(caso.plazo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-400">No hay casos vencidos.</p>
        )}
      </div>
    </div>
  );
}
