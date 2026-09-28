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
