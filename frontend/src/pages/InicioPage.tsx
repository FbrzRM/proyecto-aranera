import { useSession } from "../features/auth/session";

export function InicioPage() {
  const usuario = useSession((s) => s.usuario);
  if (!usuario) {
    return null;
  }
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-800">Hola, {usuario.nombre}</h2>
      <p className="text-slate-600">
        Tu rol es <span className="font-medium">{usuario.role}</span>. Usa el menu superior para navegar.
      </p>
    </div>
  );
}
