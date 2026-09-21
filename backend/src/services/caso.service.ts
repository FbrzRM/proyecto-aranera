import { Caso, EstadoCaso, transicionValida } from "../domain/caso";
import { Evidencia } from "../domain/evidencia";
import { Role } from "../domain/roles";
import { Seguimiento } from "../domain/seguimiento";
import { calcularPlazo } from "../domain/sla";
import { casoEventos } from "../events/caso-eventos";
import { CasoFiltros, CasoRepository, casoRepository } from "../repositories/caso.repository";
import { EvidenciaRepository, evidenciaRepository } from "../repositories/evidencia.repository";
import { SeguimientoRepository, seguimientoRepository } from "../repositories/seguimiento.repository";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { CasoQuery, CrearCasoInput } from "../schemas/caso.schema";
import { CrearEvidenciaInput } from "../schemas/evidencia.schema";

export class CasoNoEncontradoError extends Error {
  constructor() {
    super("Caso no encontrado");
    this.name = "CasoNoEncontradoError";
  }
}

export class TransicionInvalidaError extends Error {
  constructor(desde: EstadoCaso, hacia: EstadoCaso) {
    super(`Transicion invalida de ${desde} a ${hacia}`);
    this.name = "TransicionInvalidaError";
  }
}

export class ResponsableInvalidoError extends Error {
  constructor() {
    super("El responsable debe ser un empleado existente");
    this.name = "ResponsableInvalidoError";
  }
}

export class PagoInvalidoError extends Error {
  constructor() {
    super("El caso no admite registro de pago");
    this.name = "PagoInvalidoError";
  }
}

export class AccesoDenegadoError extends Error {
  constructor() {
    super("No autorizado para este caso");
    this.name = "AccesoDenegadoError";
  }
}

export interface Actor {
  sub: string;
  role: Role;
}

export class CasoService {
  constructor(
    private readonly casos: CasoRepository,
    private readonly users: UserRepository,
    private readonly seguimientos: SeguimientoRepository,
    private readonly evidencias: EvidenciaRepository
  ) {}

  async crear(input: CrearCasoInput, clienteId: string): Promise<Caso> {
    const caso = await this.casos.create({
      tipo: input.tipo,
      categoria: input.categoria,
      titulo: input.titulo,
      descripcion: input.descripcion,
      clienteId,
      responsableId: null,
      estado: "creado",
      plazo: calcularPlazo(input.categoria, new Date()),
      pagado: false
    });

    await casoEventos.notificar({
      casoId: caso.id,
      accion: "creado",
      descripcion: `Caso creado (${caso.tipo}/${caso.categoria})`,
      autorId: clienteId,
      estado: caso.estado
    });

    return caso;
  }

  async listar(query: CasoQuery, actor: Actor) {
    const filtros: CasoFiltros = {
      page: query.page,
      limit: query.limit,
      estado: query.estado,
      tipo: query.tipo,
      responsableId: query.responsableId,
      vencidos: query.vencidos === "true"
    };
    if (actor.role === "cliente" || actor.role === "tercero") {
      filtros.clienteId = actor.sub;
    }

    const { items, total } = await this.casos.list(filtros);
    return { items, total, page: filtros.page, limit: filtros.limit };
  }

  async obtener(id: string, actor: Actor): Promise<Caso> {
    const caso = await this.buscar(id);
    this.verificarAcceso(caso, actor);
    return caso;
  }

  async asignar(id: string, responsableId: string, autorId: string): Promise<Caso> {
    const caso = await this.buscar(id);

    const responsable = await this.users.findById(responsableId);
    if (!responsable || responsable.role !== "empleado") {
      throw new ResponsableInvalidoError();
    }
    if (!transicionValida(caso.estado, "asignado")) {
      throw new TransicionInvalidaError(caso.estado, "asignado");
    }

    const actualizado = await this.actualizar(id, { responsableId, estado: "asignado" });
    await casoEventos.notificar({
      casoId: id,
      accion: "asignado",
      descripcion: `Asignado al responsable ${responsableId}`,
      autorId,
      estado: "asignado"
    });

    return actualizado;
  }

  async cambiarEstado(id: string, nuevo: EstadoCaso, autorId: string): Promise<Caso> {
    const caso = await this.buscar(id);
    if (!transicionValida(caso.estado, nuevo)) {
      throw new TransicionInvalidaError(caso.estado, nuevo);
    }

    const actualizado = await this.actualizar(id, { estado: nuevo });
    await casoEventos.notificar({
      casoId: id,
      accion: "estado",
      descripcion: `Estado cambiado de ${caso.estado} a ${nuevo}`,
      autorId,
      estado: nuevo
    });

    return actualizado;
  }

  async registrarPago(id: string, actor: Actor): Promise<Caso> {
    const caso = await this.buscar(id);
    this.verificarAcceso(caso, actor);
    if (caso.pagado || caso.estado === "cerrado" || caso.estado === "cancelado") {
      throw new PagoInvalidoError();
    }

    const actualizado = await this.actualizar(id, { pagado: true });
    await casoEventos.notificar({
      casoId: id,
      accion: "pago",
      descripcion: "Pago registrado",
      autorId: actor.sub,
      estado: null
    });

    return actualizado;
  }

  async listarSeguimientos(casoId: string, actor: Actor): Promise<Seguimiento[]> {
    await this.obtener(casoId, actor);
    return this.seguimientos.listByCaso(casoId);
  }

  async listarEvidencias(casoId: string, actor: Actor): Promise<Evidencia[]> {
    await this.obtener(casoId, actor);
    return this.evidencias.listByCaso(casoId);
  }

  async agregarEvidencia(
    casoId: string,
    input: CrearEvidenciaInput,
    autorId: string,
    actor: Actor
  ): Promise<Evidencia> {
    await this.obtener(casoId, actor);

    const evidencia = await this.evidencias.create({
      casoId,
      nombre: input.nombre,
      url: input.url,
      descripcion: input.descripcion ?? null,
      autorId
    });

    await casoEventos.notificar({
      casoId,
      accion: "evidencia",
      descripcion: `Evidencia adjuntada: ${input.nombre}`,
      autorId,
      estado: null
    });

    return evidencia;
  }

  private async buscar(id: string): Promise<Caso> {
    const caso = await this.casos.findById(id);
    if (!caso) {
      throw new CasoNoEncontradoError();
    }
    return caso;
  }

  private async actualizar(id: string, data: Parameters<CasoRepository["update"]>[1]): Promise<Caso> {
    const actualizado = await this.casos.update(id, data);
    if (!actualizado) {
      throw new CasoNoEncontradoError();
    }
    return actualizado;
  }

  private verificarAcceso(caso: Caso, actor: Actor) {
    if ((actor.role === "cliente" || actor.role === "tercero") && caso.clienteId !== actor.sub) {
      throw new AccesoDenegadoError();
    }
  }
}

export const casoService = new CasoService(
  casoRepository,
  userRepository,
  seguimientoRepository,
  evidenciaRepository
);
