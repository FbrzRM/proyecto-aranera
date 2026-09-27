import { http } from "../../lib/http";
import { Caso } from "../casos/api";

export interface ResumenMetricas {
  total: number;
  conResponsable: number;
  sinResponsable: number;
  vencidos: number;
  pagados: number;
  porcentajeConResponsable: number;
  porcentajeVencidos: number;
  porEstado: Record<string, number>;
  porTipo: Record<string, number>;
}

export interface CargaEmpleado {
  responsableId: string;
  nombre: string;
  total: number;
  abiertos: number;
  vencidos: number;
}

export async function obtenerResumen(): Promise<ResumenMetricas> {
  const { data } = await http.get<ResumenMetricas>("/metricas/resumen");
  return data;
}

export async function obtenerEmpleados(): Promise<{ items: CargaEmpleado[] }> {
  const { data } = await http.get<{ items: CargaEmpleado[] }>("/metricas/empleados");
  return data;
}

export async function obtenerVencidos(): Promise<{ items: Caso[]; total: number }> {
  const { data } = await http.get<{ items: Caso[]; total: number }>("/metricas/vencidos");
  return data;
}
