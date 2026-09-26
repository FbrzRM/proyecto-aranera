import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

export function useCasos() {
  return useQuery({ queryKey: ["casos"], queryFn: api.listarCasos });
}

export function useCaso(id: string) {
  return useQuery({ queryKey: ["caso", id], queryFn: () => api.obtenerCaso(id) });
}

export function useSeguimientos(id: string) {
  return useQuery({ queryKey: ["seguimientos", id], queryFn: () => api.listarSeguimientos(id) });
}

export function useEvidencias(id: string) {
  return useQuery({ queryKey: ["evidencias", id], queryFn: () => api.listarEvidencias(id) });
}

export function useCrearCaso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.crearCaso,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["casos"] })
  });
}

export function usePagarCaso(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.pagarCaso(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caso", id] });
      qc.invalidateQueries({ queryKey: ["seguimientos", id] });
      qc.invalidateQueries({ queryKey: ["casos"] });
    }
  });
}
