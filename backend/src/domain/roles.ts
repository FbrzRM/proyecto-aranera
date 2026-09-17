export const roles = ["administrador", "jefatura", "empleado", "cliente", "tercero"] as const;

export type Role = (typeof roles)[number];
