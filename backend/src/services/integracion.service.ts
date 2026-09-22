import { firmarToken } from "../auth/token";
import { aCrearCasoInput, aPedidoExterno } from "../integration/anti-corrupcion";
import { CasoQuery } from "../schemas/caso.schema";
import { CrearPedidoInput } from "../schemas/integracion.schema";
import { Actor, casoService } from "./caso.service";
import { terceroService } from "./tercero.service";

export class CredencialesInvalidasError extends Error {
  constructor() {
    super("Credenciales de integracion invalidas");
    this.name = "CredencialesInvalidasError";
  }
}

function actorDe(terceroId: string): Actor {
  return { sub: terceroId, role: "tercero" };
}

const consultaBase: CasoQuery = { page: 1, limit: 100 };

export class IntegracionService {
  async emitirToken(clientId: string, clientSecret: string) {
    const tercero = await terceroService.validarCredenciales(clientId, clientSecret);
    if (!tercero) {
      throw new CredencialesInvalidasError();
    }
    const token = firmarToken({ sub: tercero.id, email: tercero.clientId, role: "tercero" });
    return { token };
  }

  async crearPedido(terceroId: string, input: CrearPedidoInput) {
    const caso = await casoService.crear(aCrearCasoInput(input), terceroId);
    return aPedidoExterno(caso);
  }

  async listarPedidos(terceroId: string) {
    const { items } = await casoService.listar(consultaBase, actorDe(terceroId));
    return { items: items.map(aPedidoExterno) };
  }

  async obtenerPedido(terceroId: string, id: string) {
    const caso = await casoService.obtener(id, actorDe(terceroId));
    return aPedidoExterno(caso);
  }
}

export const integracionService = new IntegracionService();
