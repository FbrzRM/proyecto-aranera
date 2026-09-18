import { Caso, EstadoCaso, transicionValida } from "../domain/caso";
import { Role } from "../domain/roles";
import { calcularPlazo } from "../domain/sla";
import { CasoFiltros, CasoRepository, casoRepository } from "../repositories/caso.repository";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { CasoQuery, CrearCasoInput } from "../schemas/caso.schema";

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
  constructor(private readonly casos: CasoRepository, private readonly users: UserRepository) {}

  async crear(input: CrearCasoInput, clienteId: string): Promise<Caso> {
    return this.casos.create({
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

  async asignar(id: string, responsableId: string): Promise<Caso> {
    const caso = await this.buscar(id);

    const responsable = await this.users.findById(responsableId);
    if (!responsable || responsable.role !== "empleado") {
      throw new ResponsableInvalidoError();
    }
    if (!transicionValida(caso.estado, "asignado")) {
      throw new TransicionInvalidaError(caso.estado, "asignado");
    }

    return this.actualizar(id, { responsableId, estado: "asignado" });
  }

  async cambiarEstado(id: string, nuevo: EstadoCaso): Promise<Caso> {
    const caso = await this.buscar(id);
    if (!transicionValida(caso.estado, nuevo)) {
      throw new TransicionInvalidaError(caso.estado, nuevo);
    }
    return this.actualizar(id, { estado: nuevo });
  }

  async registrarPago(id: string, actor: Actor): Promise<Caso> {
    const caso = await this.buscar(id);
    this.verificarAcceso(caso, actor);
    if (caso.pagado || caso.estado === "cerrado" || caso.estado === "cancelado") {
      throw new PagoInvalidoError();
    }
    return this.actualizar(id, { pagado: true });
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

export const casoService = new CasoService(casoRepository, userRepository);
