import { Role } from "./roles";

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: Role;
  passwordHash: string;
}
