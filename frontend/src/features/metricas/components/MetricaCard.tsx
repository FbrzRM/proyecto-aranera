export function MetricaCard({
  titulo,
  valor,
  detalle,
  acento
}: {
  titulo: string;
  valor: string | number;
  detalle?: string;
  acento?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className={`mt-1 text-3xl font-bold ${acento ?? "text-slate-800"}`}>{valor}</p>
      {detalle && <p className="mt-1 text-xs text-slate-400">{detalle}</p>}
    </div>
  );
}
