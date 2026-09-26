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

export interface CasoFiltros {
  estado?: EstadoCaso;
  tipo?: TipoCaso;
  responsableId?: string;
  vencidos?: boolean;
}

export async function listarCasos(filtros: CasoFiltros = {}): Promise<CasosPagina> {
  const params = new URLSearchParams();
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.responsableId) params.set("responsableId", filtros.responsableId);
  if (filtros.vencidos) params.set("vencidos", "true");
  params.set("limit", "100");
  const { data } = await http.get<CasosPagina>(`/casos?${params.toString()}`);
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

export async function asignarCaso(id: string, responsableId: string): Promise<Caso> {
  const { data } = await http.patch<Caso>(`/casos/${id}/asignar`, { responsableId });
  return data;
}

export async function cambiarEstado(id: string, estado: EstadoCaso): Promise<Caso> {
  const { data } = await http.patch<Caso>(`/casos/${id}/estado`, { estado });
  return data;
}

export interface CrearEvidenciaBody {
  nombre: string;
  url: string;
  descripcion?: string;
}

export async function agregarEvidencia(id: string, body: CrearEvidenciaBody): Promise<Evidencia> {
  const { data } = await http.post<Evidencia>(`/casos/${id}/evidencias`, body);
  return data;
}
