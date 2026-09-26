import { EstadoCaso } from "../api";

const estilos: Record<EstadoCaso, string> = {
  creado: "bg-slate-100 text-slate-700",
  recibido: "bg-blue-100 text-blue-700",
  asignado: "bg-indigo-100 text-indigo-700",
  despachando: "bg-amber-100 text-amber-700",
  empacando: "bg-amber-100 text-amber-700",
  pagado: "bg-emerald-100 text-emerald-700",
  enviado: "bg-cyan-100 text-cyan-700",
  cerrado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700"
};

export function EstadoBadge({ estado }: { estado: EstadoCaso }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estilos[estado]}`}>
      {estado}
    </span>
  );
}
