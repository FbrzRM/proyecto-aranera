import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

export function useCasos() {
  return useQuery({ queryKey: ["casos"], queryFn: () => api.listarCasos() });
}

export function useCasosFiltrados(filtros: api.CasoFiltros) {
  return useQuery({ queryKey: ["casos", filtros], queryFn: () => api.listarCasos(filtros) });
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

export function useAsignarCaso(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (responsableId: string) => api.asignarCaso(id, responsableId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caso", id] });
      qc.invalidateQueries({ queryKey: ["seguimientos", id] });
      qc.invalidateQueries({ queryKey: ["casos"] });
    }
  });
}

export function useCambiarEstado(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (estado: api.EstadoCaso) => api.cambiarEstado(id, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caso", id] });
      qc.invalidateQueries({ queryKey: ["seguimientos", id] });
      qc.invalidateQueries({ queryKey: ["casos"] });
    }
  });
}

export function useAgregarEvidencia(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: api.CrearEvidenciaBody) => api.agregarEvidencia(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["evidencias", id] });
      qc.invalidateQueries({ queryKey: ["seguimientos", id] });
    }
  });
}
