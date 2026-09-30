import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Tercero } from "../domain/tercero";
import { TerceroRepository, TerceroUpdate, terceroRepository } from "../repositories/tercero.repository";
import { ActualizarTerceroInput, CrearTerceroInput } from "../schemas/tercero.schema";

export class TerceroNoEncontradoError extends Error {
  constructor() {
    super("Tercero no encontrado");
    this.name = "TerceroNoEncontradoError";
  }
}

function toPublic(tercero: Tercero) {
  return { id: tercero.id, nombre: tercero.nombre, clientId: tercero.clientId, activo: tercero.activo };
}

export class TerceroService {
  constructor(private readonly terceros: TerceroRepository) {}

  async crear(input: CrearTerceroInput) {
    const clientId = `arn_${randomBytes(9).toString("hex")}`;
    const clientSecret = randomBytes(24).toString("hex");
    const secretHash = bcrypt.hashSync(clientSecret, 10);

    const tercero = await this.terceros.create({
      nombre: input.nombre,
      clientId,
      secretHash,
      activo: true
    });

    return { id: tercero.id, nombre: tercero.nombre, clientId, clientSecret, activo: tercero.activo };
  }

  async listar() {
    const items = (await this.terceros.list()).map(toPublic);
    return { items };
  }

  async actualizar(id: string, input: ActualizarTerceroInput) {
    const data: TerceroUpdate = {};
    if (input.nombre !== undefined) {
      data.nombre = input.nombre;
    }
    if (input.activo !== undefined) {
      data.activo = input.activo;
    }

    const updated = await this.terceros.update(id, data);
    if (!updated) {
      throw new TerceroNoEncontradoError();
    }
    return toPublic(updated);
  }

  async validarCredenciales(clientId: string, clientSecret: string): Promise<Tercero | null> {
    const tercero = await this.terceros.findByClientId(clientId);
    if (!tercero || !tercero.activo) {
      return null;
    }
    if (!bcrypt.compareSync(clientSecret, tercero.secretHash)) {
      return null;
    }
    return tercero;
  }
}

export const terceroService = new TerceroService(terceroRepository);
