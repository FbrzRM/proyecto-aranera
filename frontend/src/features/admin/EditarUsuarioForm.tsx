import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActualizarUsuarioBody, Usuario } from "./usuarios.api";
import { useActualizarUsuario } from "./usuarios.hooks";
import { EditarUsuarioInput, editarUsuarioSchema } from "./usuarios.schema";

const roles: EditarUsuarioInput["role"][] = ["administrador", "jefatura", "empleado", "cliente"];

export function EditarUsuarioForm({ usuario, onDone }: { usuario: Usuario; onDone: () => void }) {
  const actualizar = useActualizarUsuario();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditarUsuarioInput>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: { nombre: usuario.nombre, role: usuario.role as EditarUsuarioInput["role"], activo: usuario.activo, password: "" }
  });

  const onSubmit = (values: EditarUsuarioInput) => {
    const body: ActualizarUsuarioBody = { nombre: values.nombre, role: values.role, activo: values.activo };
    if (values.password) {
      body.password = values.password;
    }
    actualizar.mutate({ id: usuario.id, body }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("nombre")}
          />
          {errors.nombre && <p className="text-xs text-red-600">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Rol</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none"
            {...register("role")}
          >
            {roles.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nueva contraseña</label>
          <input
            type="password"
            placeholder="Dejar vacío para mantener"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 pt-7 text-sm text-slate-700">
          <input type="checkbox" className="rounded border-slate-300" {...register("activo")} />
          Activo
        </label>
      </div>

      {actualizar.isError && <p className="text-sm text-red-600">No se pudo actualizar el usuario.</p>}

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
