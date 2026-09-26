import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCrearCaso } from "./hooks";
import { CrearCasoInput, crearCasoSchema } from "./schema";

const tipos: CrearCasoInput["tipo"][] = ["pedido", "reclamo", "requerimiento"];
const categorias: CrearCasoInput["categoria"][] = ["equipo", "consumible", "reactivo"];

export function CrearCasoPage() {
  const navigate = useNavigate();
  const crear = useCrearCaso();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CrearCasoInput>({
    resolver: zodResolver(crearCasoSchema),
    defaultValues: { tipo: "pedido", categoria: "consumible", titulo: "", descripcion: "" }
  });

  const onSubmit = (values: CrearCasoInput) => {
    crear.mutate(values, { onSuccess: (caso) => navigate(`/casos/${caso.id}`) });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Nuevo caso</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="tipo">
              Tipo
            </label>
            <select
              id="tipo"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
              {...register("tipo")}
            >
              {tipos.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="categoria">
              Categoría
            </label>
            <select
              id="categoria"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
              {...register("categoria")}
            >
              {categorias.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("titulo")}
          />
          {errors.titulo && <p className="text-xs text-red-600">{errors.titulo.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("descripcion")}
          />
          {errors.descripcion && <p className="text-xs text-red-600">{errors.descripcion.message}</p>}
        </div>

        {crear.isError && <p className="text-sm text-red-600">No se pudo crear el caso.</p>}

        <div className="flex items-center justify-end gap-3">
          <Link to="/casos" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={crear.isPending}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {crear.isPending ? "Creando..." : "Crear caso"}
          </button>
        </div>
      </form>
    </div>
  );
}
