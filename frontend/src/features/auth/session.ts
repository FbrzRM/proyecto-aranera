import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "administrador" | "jefatura" | "empleado" | "cliente" | "tercero";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  role: Role;
}

interface SessionState {
  token: string | null;
  usuario: Usuario | null;
  iniciarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      iniciarSesion: (token, usuario) => set({ token, usuario }),
      cerrarSesion: () => set({ token: null, usuario: null })
    }),
    { name: "araneda-session" }
  )
);
