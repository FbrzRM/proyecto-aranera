import { http } from "../../lib/http";

export interface Tercero {
  id: string;
  nombre: string;
  clientId: string;
  activo: boolean;
}

export interface TerceroCreado {
  id: string;
  nombre: string;
  clientId: string;
  clientSecret: string;
  activo: boolean;
}

export async function listarTerceros(): Promise<{ items: Tercero[] }> {
  const { data } = await http.get<{ items: Tercero[] }>("/terceros");
  return data;
}

export async function crearTercero(nombre: string): Promise<TerceroCreado> {
  const { data } = await http.post<TerceroCreado>("/terceros", { nombre });
  return data;
}
