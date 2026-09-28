import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./usuarios.api";

export function useUsuarios() {
  return useQuery({ queryKey: ["usuarios"], queryFn: api.listarUsuarios });
}

export function useCrearUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.crearUsuario,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] })
  });
}

export function useActualizarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: api.ActualizarUsuarioBody }) => api.actualizarUsuario(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] })
  });
}
