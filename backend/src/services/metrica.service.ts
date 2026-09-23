import { CasoRepository, casoRepository } from "../repositories/caso.repository";
import { MetricaRepository, metricaRepository } from "../repositories/metrica.repository";
import { UserRepository, userRepository } from "../repositories/user.repository";

function porcentaje(parte: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((parte / total) * 100);
}

export class MetricaService {
  constructor(
    private readonly metricas: MetricaRepository,
    private readonly casos: CasoRepository,
    private readonly users: UserRepository
  ) {}

  async resumen() {
    const r = await this.metricas.resumen();
    return {
      total: r.total,
      conResponsable: r.conResponsable,
      sinResponsable: r.total - r.conResponsable,
      vencidos: r.vencidos,
      pagados: r.pagados,
      porcentajeConResponsable: porcentaje(r.conResponsable, r.total),
      porcentajeVencidos: porcentaje(r.vencidos, r.total),
      porEstado: r.porEstado,
      porTipo: r.porTipo
    };
  }

  async empleados() {
    const carga = await this.metricas.cargaPorEmpleado();
    const items = await Promise.all(
      carga.map(async (c) => {
        const usuario = await this.users.findById(c.responsableId);
        return {
          responsableId: c.responsableId,
          nombre: usuario?.nombre ?? "(desconocido)",
          total: c.total,
          abiertos: c.abiertos,
          vencidos: c.vencidos
        };
      })
    );
    return { items };
  }

  async vencidos() {
    const { items, total } = await this.casos.list({ page: 1, limit: 100, vencidos: true });
    return { items, total };
  }
}

export const metricaService = new MetricaService(metricaRepository, casoRepository, userRepository);
