import { Tercero } from "../domain/tercero";
import { TerceroModel } from "../models/tercero.model";

export interface NewTercero {
  nombre: string;
  clientId: string;
  secretHash: string;
  activo: boolean;
}

export interface TerceroRepository {
  create(data: NewTercero): Promise<Tercero>;
  findByClientId(clientId: string): Promise<Tercero | null>;
  list(): Promise<Tercero[]>;
}

interface TerceroDocument {
  _id: unknown;
  nombre: string;
  clientId: string;
  secretHash: string;
  activo: boolean;
}

function toTercero(doc: TerceroDocument): Tercero {
  return {
    id: String(doc._id),
    nombre: doc.nombre,
    clientId: doc.clientId,
    secretHash: doc.secretHash,
    activo: doc.activo
  };
}

class MongoTerceroRepository implements TerceroRepository {
  async create(data: NewTercero): Promise<Tercero> {
    const created = await TerceroModel.create(data);
    return toTercero(created.toObject() as TerceroDocument);
  }

  async findByClientId(clientId: string): Promise<Tercero | null> {
    const doc = await TerceroModel.findOne({ clientId }).lean<TerceroDocument>();
    return doc ? toTercero(doc) : null;
  }

  async list(): Promise<Tercero[]> {
    const docs = await TerceroModel.find().sort({ createdAt: -1 }).lean<TerceroDocument[]>();
    return docs.map(toTercero);
  }
}

export const terceroRepository: TerceroRepository = new MongoTerceroRepository();
