import { Role } from "../features/auth/session";

export interface EnlaceMenu {
  to: string;
  label: string;
}

export const enlacesPorRol: Record<Role, EnlaceMenu[]> = {
  administrador: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/usuarios", label: "Usuarios" },
    { to: "/terceros", label: "Terceros" }
  ],
  jefatura: [{ to: "/dashboard", label: "Dashboard" }],
  empleado: [{ to: "/bandeja", label: "Bandeja" }],
  cliente: [{ to: "/casos", label: "Mis casos" }],
  tercero: []
};

export function rutaInicialPorRol(role: Role): string | null {
  return enlacesPorRol[role][0]?.to ?? null;
}
