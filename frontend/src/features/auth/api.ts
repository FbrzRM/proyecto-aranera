import { http } from "../../lib/http";
import { Schemas } from "../../lib/contract";
import { LoginInput } from "./schema";
import { Usuario } from "./session";

export type LoginResponse = Omit<Schemas["LoginResponse"], "user"> & { user: Usuario };

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login", input);
  return data;
}
