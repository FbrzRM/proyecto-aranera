import { http } from "../../lib/http";
import { Schemas } from "../../lib/contract";
import { Caso } from "../casos/api";

export type ResumenMetricas = Schemas["ResumenMetricas"];
export type CargaEmpleado = Schemas["CargaEmpleado"];

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
