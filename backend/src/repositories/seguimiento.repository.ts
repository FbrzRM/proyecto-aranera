import { EstadoCaso } from "../domain/caso";
import { AccionSeguimiento, Seguimiento } from "../domain/seguimiento";
import { SeguimientoModel } from "../models/seguimiento.model";

export interface NewSeguimiento {
  casoId: string;
  accion: AccionSeguimiento;
  descripcion: string;
  autorId: string;
  estado: EstadoCaso | null;
}

export interface SeguimientoRepository {
  create(data: NewSeguimiento): Promise<Seguimiento>;
  listByCaso(casoId: string): Promise<Seguimiento[]>;
}

interface SeguimientoDocument {
  _id: unknown;
  casoId: string;
  accion: string;
  descripcion: string;
  autorId: string;
  estado: string | null;
  createdAt: Date;
}

function toSeguimiento(doc: SeguimientoDocument): Seguimiento {
  return {
    id: String(doc._id),
    casoId: doc.casoId,
    accion: doc.accion as AccionSeguimiento,
    descripcion: doc.descripcion,
    autorId: doc.autorId,
    estado: (doc.estado as EstadoCaso | null) ?? null,
    creadoEn: doc.createdAt.toISOString()
  };
}

class MongoSeguimientoRepository implements SeguimientoRepository {
  async create(data: NewSeguimiento): Promise<Seguimiento> {
    const created = await SeguimientoModel.create(data);
    return toSeguimiento(created.toObject() as SeguimientoDocument);
  }

  async listByCaso(casoId: string): Promise<Seguimiento[]> {
    const docs = await SeguimientoModel.find({ casoId }).sort({ createdAt: 1 }).lean<SeguimientoDocument[]>();
    return docs.map(toSeguimiento);
  }
}

export const seguimientoRepository: SeguimientoRepository = new MongoSeguimientoRepository();
