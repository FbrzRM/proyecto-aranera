import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import { LoginInput, loginSchema } from "./schema";
import { useSession } from "./session";

export function LoginPage() {
  const navigate = useNavigate();
  const iniciarSesion = useSession((s) => s.iniciarSesion);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      iniciarSesion(data.token, data.user);
      navigate("/");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Araneda</h1>
          <p className="text-sm text-slate-500">Inicia sesion para continuar</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {mutation.isError && <p className="text-sm text-red-600">Credenciales invalidas</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-slate-800 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
