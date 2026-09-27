export function BarraDistribucion({
  etiqueta,
  valor,
  max,
  color
}: {
  etiqueta: string;
  valor: number;
  max: number;
  color?: string;
}) {
  const ancho = max > 0 ? Math.round((valor / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span className="capitalize">{etiqueta}</span>
        <span>{valor}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color ?? "bg-slate-700"}`} style={{ width: `${ancho}%` }} />
      </div>
    </div>
  );
}
