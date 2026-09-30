import { useState } from "react";
import { Tercero } from "./terceros.api";
import { useActualizarTercero } from "./terceros.hooks";

export function EditarTerceroForm({ tercero, onDone }: { tercero: Tercero; onDone: () => void }) {
  const [nombre, setNombre] = useState(tercero.nombre);
  const [activo, setActivo] = useState(tercero.activo);
  const actualizar = useActualizarTercero();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nombre.trim()) {
      return;
    }
    actualizar.mutate({ id: tercero.id, body: { nombre: nombre.trim(), activo } }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-slate-50 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={activo}
            onChange={(event) => setActivo(event.target.checked)}
            className="rounded border-slate-300"
          />
          Activo
        </label>
      </div>

      {actualizar.isError && <p className="text-sm text-red-600">No se pudo actualizar el tercero.</p>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-white"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={actualizar.isPending}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {actualizar.isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
