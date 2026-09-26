import { EstadoCaso, TipoCaso } from "./api";

export const transiciones: Record<EstadoCaso, EstadoCaso[]> = {
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

export const rutaPedido: EstadoCaso[] = [
  "creado",
  "recibido",
  "asignado",
  "despachando",
  "empacando",
  "enviado",
  "cerrado"
];

export const rutaGestion: EstadoCaso[] = ["creado", "recibido", "asignado", "cerrado"];

export function rutaDe(tipo: TipoCaso): EstadoCaso[] {
  return tipo === "pedido" ? rutaPedido : rutaGestion;
}

export function siguientesEstados(estado: EstadoCaso): EstadoCaso[] {
  return transiciones[estado].filter((e) => e !== "asignado" && e !== "pagado" && e !== "cancelado");
}

export function puedeTomar(estado: EstadoCaso): boolean {
  return transiciones[estado].includes("asignado");
}

export function puedeCancelar(estado: EstadoCaso): boolean {
  return transiciones[estado].includes("cancelado");
}
