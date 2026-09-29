import { useState } from "react";
import { TerceroCreado } from "./terceros.api";
import { useCrearTercero, useTerceros } from "./terceros.hooks";

export function TercerosPage() {
  const [nombre, setNombre] = useState("");
  const [credencial, setCredencial] = useState<TerceroCreado | null>(null);
  const { data, isLoading, isError } = useTerceros();
  const crear = useCrearTercero();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nombre.trim()) {
      return;
    }
    crear.mutate(nombre.trim(), {
      onSuccess: (tercero) => {
        setCredencial(tercero);
        setNombre("");
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Terceros</h2>

      <form onSubmit={onSubmit} className="flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="nombre">
            Nombre de la empresa
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={crear.isPending}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {crear.isPending ? "Creando..." : "Registrar tercero"}
        </button>
      </form>

      {crear.isError && <p className="text-sm text-red-600">No se pudo registrar el tercero.</p>}

      {credencial && (
        <div className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-800">
            Guarda estas credenciales ahora: el secreto no se vuelve a mostrar.
          </p>
          <div className="grid grid-cols-1 gap-1 text-sm text-slate-700">
            <span>
              <span className="font-medium">clientId:</span>{" "}
              <code className="rounded bg-white px-1 py-0.5">{credencial.clientId}</code>
            </span>
            <span>
              <span className="font-medium">clientSecret:</span>{" "}
              <code className="rounded bg-white px-1 py-0.5">{credencial.clientSecret}</code>
            </span>
          </div>
          <button
            onClick={() => setCredencial(null)}
            className="text-sm text-amber-800 underline hover:text-amber-900"
          >
            Entendido, ocultar
          </button>
        </div>
      )}

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      {isError && <p className="text-red-600">No se pudieron cargar los terceros.</p>}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aún no hay terceros registrados.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">clientId</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((tercero) => (
                <tr key={tercero.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{tercero.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <code>{tercero.clientId}</code>
                  </td>
                  <td className="px-4 py-3">
                    {tercero.activo ? (
                      <span className="text-emerald-600">Activo</span>
                    ) : (
                      <span className="text-slate-400">Inactivo</span>
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
