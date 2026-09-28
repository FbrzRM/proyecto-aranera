import { http } from "../../lib/http";
import { Role } from "../auth/session";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  role: Role;
  activo: boolean;
}

export interface UsuariosPagina {
  items: Usuario[];
  total: number;
  page: number;
  limit: number;
}

export interface CrearUsuarioBody {
  email: string;
  nombre: string;
  password: string;
  role: Role;
}

export interface ActualizarUsuarioBody {
  nombre?: string;
  password?: string;
  role?: Role;
  activo?: boolean;
}

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
