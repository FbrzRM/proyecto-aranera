import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./terceros.api";

export function useTerceros() {
  return useQuery({ queryKey: ["terceros"], queryFn: api.listarTerceros });
}

export function useCrearTercero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.crearTercero,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["terceros"] })
  });
}

export function useActualizarTercero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: api.ActualizarTerceroBody }) => api.actualizarTercero(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["terceros"] })
  });
}
