import { http } from "../../lib/http";
import { Schemas } from "../../lib/contract";

export type TipoCaso = Schemas["CrearCaso"]["tipo"];
export type Categoria = Schemas["CrearCaso"]["categoria"];
export type EstadoCaso = Schemas["CambiarEstadoCaso"]["estado"];

export type Caso = Omit<Schemas["Caso"], "tipo" | "categoria" | "estado"> & {
  tipo: TipoCaso;
  categoria: Categoria;
  estado: EstadoCaso;
};

export type Seguimiento = Omit<Schemas["Seguimiento"], "estado"> & { estado: EstadoCaso | null };

export type Evidencia = Schemas["Evidencia"];

export type CasosPagina = Omit<Schemas["CasosPaginados"], "items"> & { items: Caso[] };

export type CrearCasoBody = Schemas["CrearCaso"];

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

export type CrearEvidenciaBody = Schemas["CrearEvidencia"];

export async function agregarEvidencia(id: string, body: CrearEvidenciaBody): Promise<Evidencia> {
  const { data } = await http.post<Evidencia>(`/casos/${id}/evidencias`, body);
  return data;
}
