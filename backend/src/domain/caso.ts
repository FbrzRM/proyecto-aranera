export const tiposCaso = ["pedido", "reclamo", "requerimiento"] as const;
export type TipoCaso = (typeof tiposCaso)[number];

export const categorias = ["equipo", "consumible", "reactivo"] as const;
export type Categoria = (typeof categorias)[number];

export const estadosCaso = [
  "creado",
  "recibido",
  "asignado",
  "despachando",
  "empacando",
  "pagado",
  "enviado",
  "cerrado",
  "cancelado"
] as const;
export type EstadoCaso = (typeof estadosCaso)[number];

export interface Caso {
  id: string;
  tipo: TipoCaso;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  clienteId: string;
  responsableId: string | null;
  estado: EstadoCaso;
  plazo: string;
  pagado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

const transiciones: Record<EstadoCaso, EstadoCaso[]> = {
  creado: ["recibido", "asignado", "cancelado"],
  recibido: ["asignado", "cancelado"],
  asignado: ["despachando", "cerrado", "cancelado"],
  despachando: ["empacando", "cancelado"],
  empacando: ["pagado", "enviado", "cancelado"],
  pagado: ["enviado", "cerrado"],
  enviado: ["cerrado"],
  cerrado: [],
  cancelado: []
};

export function transicionValida(desde: EstadoCaso, hacia: EstadoCaso): boolean {
  return transiciones[desde].includes(hacia);
}
