import { EstadoCaso } from "./caso";

export const accionesSeguimiento = ["creado", "estado", "asignado", "pago", "evidencia"] as const;
export type AccionSeguimiento = (typeof accionesSeguimiento)[number];

export interface Seguimiento {
  id: string;
  casoId: string;
  accion: AccionSeguimiento;
  descripcion: string;
  autorId: string;
  estado: EstadoCaso | null;
  creadoEn: string;
}
