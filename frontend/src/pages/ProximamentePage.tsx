export function ProximamentePage({ titulo }: { titulo: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold text-slate-800">{titulo}</h2>
      <p className="mt-2 text-slate-500">Esta seccion se construira en una fase siguiente.</p>
    </div>
  );
}
