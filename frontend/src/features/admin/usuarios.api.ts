import { http } from "../../lib/http";
import { Schemas } from "../../lib/contract";

export type Usuario = Schemas["Usuario"];
export type UsuariosPagina = Schemas["UsuariosPaginados"];
export type CrearUsuarioBody = Schemas["CrearUsuario"];
export type ActualizarUsuarioBody = Schemas["ActualizarUsuario"];

export async function listarUsuarios(): Promise<UsuariosPagina> {
  const { data } = await http.get<UsuariosPagina>("/usuarios?limit=100");
  return data;
}

export async function crearUsuario(body: CrearUsuarioBody): Promise<Usuario> {
  const { data } = await http.post<Usuario>("/usuarios", body);
  return data;
}

export async function actualizarUsuario(id: string, body: ActualizarUsuarioBody): Promise<Usuario> {
  const { data } = await http.patch<Usuario>(`/usuarios/${id}`, body);
  return data;
}
