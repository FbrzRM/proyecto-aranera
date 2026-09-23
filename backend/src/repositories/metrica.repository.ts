import { CasoModel } from "../models/caso.model";

export interface ResumenMetricas {
  total: number;
  conResponsable: number;
  vencidos: number;
  pagados: number;
  porEstado: Record<string, number>;
  porTipo: Record<string, number>;
}

export interface CargaEmpleado {
  responsableId: string;
  total: number;
  abiertos: number;
  vencidos: number;
}

export interface MetricaRepository {
  resumen(): Promise<ResumenMetricas>;
  cargaPorEmpleado(): Promise<CargaEmpleado[]>;
}

const cerrados = ["cerrado", "cancelado"];

class MongoMetricaRepository implements MetricaRepository {
  async resumen(): Promise<ResumenMetricas> {
    const ahora = new Date();
    const [total, conResponsable, vencidos, pagados, porEstadoDocs, porTipoDocs] = await Promise.all([
      CasoModel.countDocuments(),
      CasoModel.countDocuments({ responsableId: { $ne: null } }),
      CasoModel.countDocuments({ plazo: { $lt: ahora }, estado: { $nin: cerrados } }),
      CasoModel.countDocuments({ pagado: true }),
      CasoModel.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$estado", n: { $sum: 1 } } }]),
      CasoModel.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$tipo", n: { $sum: 1 } } }])
    ]);

    const porEstado = Object.fromEntries(porEstadoDocs.map((d) => [d._id, d.n]));
    const porTipo = Object.fromEntries(porTipoDocs.map((d) => [d._id, d.n]));
    return { total, conResponsable, vencidos, pagados, porEstado, porTipo };
  }

  async cargaPorEmpleado(): Promise<CargaEmpleado[]> {
    const ahora = new Date();
    const docs = await CasoModel.aggregate<{ _id: string; total: number; abiertos: number; vencidos: number }>([
      { $match: { responsableId: { $ne: null } } },
      {
        $group: {
          _id: "$responsableId",
          total: { $sum: 1 },
          abiertos: { $sum: { $cond: [{ $in: ["$estado", cerrados] }, 0, 1] } },
          vencidos: {
            $sum: {
              $cond: [{ $and: [{ $lt: ["$plazo", ahora] }, { $not: [{ $in: ["$estado", cerrados] }] }] }, 1, 0]
            }
          }
        }
      }
    ]);

    return docs.map((d) => ({ responsableId: d._id, total: d.total, abiertos: d.abiertos, vencidos: d.vencidos }));
  }
}

export const metricaRepository: MetricaRepository = new MongoMetricaRepository();
