import { http } from "../../lib/http";

export type TipoCaso = "pedido" | "reclamo" | "requerimiento";
export type Categoria = "equipo" | "consumible" | "reactivo";
export type EstadoCaso =
  | "creado"
  | "recibido"
  | "asignado"
  | "despachando"
  | "empacando"
  | "pagado"
  | "enviado"
  | "cerrado"
  | "cancelado";

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

export interface Seguimiento {
  id: string;
  casoId: string;
  accion: string;
  descripcion: string;
  autorId: string;
  estado: EstadoCaso | null;
  creadoEn: string;
}

export interface Evidencia {
  id: string;
  casoId: string;
  nombre: string;
  url: string;
  descripcion: string | null;
  autorId: string;
  creadoEn: string;
}

export interface CasosPagina {
  items: Caso[];
  total: number;
  page: number;
  limit: number;
}

export interface CrearCasoBody {
  tipo: TipoCaso;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
}

export async function listarCasos(): Promise<CasosPagina> {
  const { data } = await http.get<CasosPagina>("/casos");
  return data;
}

export async function obtenerCaso(id: string): Promise<Caso> {
  const { data } = await http.get<Caso>(`/casos/${id}`);
  return data;
}

export async function crearCaso(body: CrearCasoBody): Promise<Caso> {
  const { data } = await http.post<Caso>("/casos", body);
  return data;
}

export async function listarSeguimientos(id: string): Promise<{ items: Seguimiento[] }> {
  const { data } = await http.get<{ items: Seguimiento[] }>(`/casos/${id}/seguimientos`);
  return data;
}

export async function listarEvidencias(id: string): Promise<{ items: Evidencia[] }> {
  const { data } = await http.get<{ items: Evidencia[] }>(`/casos/${id}/evidencias`);
  return data;
}

export async function pagarCaso(id: string): Promise<Caso> {
  const { data } = await http.patch<Caso>(`/casos/${id}/pago`);
  return data;
}
