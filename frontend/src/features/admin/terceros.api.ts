import { http } from "../../lib/http";
import { Schemas } from "../../lib/contract";

export type Tercero = Schemas["Tercero"];
export type TerceroCreado = Schemas["TerceroCreado"];
export type ActualizarTerceroBody = Schemas["ActualizarTercero"];

export async function listarTerceros(): Promise<{ items: Tercero[] }> {
  const { data } = await http.get<{ items: Tercero[] }>("/terceros");
  return data;
}

export async function crearTercero(nombre: string): Promise<TerceroCreado> {
  const { data } = await http.post<TerceroCreado>("/terceros", { nombre });
  return data;
}

export async function actualizarTercero(id: string, body: ActualizarTerceroBody): Promise<Tercero> {
  const { data } = await http.patch<Tercero>(`/terceros/${id}`, body);
  return data;
}
