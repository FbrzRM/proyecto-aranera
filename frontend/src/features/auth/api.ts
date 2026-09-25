import { http } from "../../lib/http";
import { LoginInput } from "./schema";
import { Usuario } from "./session";

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login", input);
  return data;
}
