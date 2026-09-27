import { useQuery } from "@tanstack/react-query";
import * as api from "./api";

export function useResumen() {
  return useQuery({ queryKey: ["metricas", "resumen"], queryFn: api.obtenerResumen });
}

export function useEmpleadosMetricas() {
  return useQuery({ queryKey: ["metricas", "empleados"], queryFn: api.obtenerEmpleados });
}

export function useVencidos() {
  return useQuery({ queryKey: ["metricas", "vencidos"], queryFn: api.obtenerVencidos });
}
