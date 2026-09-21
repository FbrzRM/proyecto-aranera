import { Evidencia } from "../domain/evidencia";
import { EvidenciaModel } from "../models/evidencia.model";

export interface NewEvidencia {
  casoId: string;
  nombre: string;
  url: string;
  descripcion: string | null;
  autorId: string;
}

export interface EvidenciaRepository {
  create(data: NewEvidencia): Promise<Evidencia>;
  listByCaso(casoId: string): Promise<Evidencia[]>;
}

interface EvidenciaDocument {
  _id: unknown;
  casoId: string;
  nombre: string;
  url: string;
  descripcion: string | null;
  autorId: string;
  createdAt: Date;
}

function toEvidencia(doc: EvidenciaDocument): Evidencia {
  return {
    id: String(doc._id),
    casoId: doc.casoId,
    nombre: doc.nombre,
    url: doc.url,
    descripcion: doc.descripcion ?? null,
    autorId: doc.autorId,
    creadoEn: doc.createdAt.toISOString()
  };
}

class MongoEvidenciaRepository implements EvidenciaRepository {
  async create(data: NewEvidencia): Promise<Evidencia> {
    const created = await EvidenciaModel.create(data);
    return toEvidencia(created.toObject() as EvidenciaDocument);
  }

  async listByCaso(casoId: string): Promise<Evidencia[]> {
    const docs = await EvidenciaModel.find({ casoId }).sort({ createdAt: 1 }).lean<EvidenciaDocument[]>();
    return docs.map(toEvidencia);
  }
}

export const evidenciaRepository: EvidenciaRepository = new MongoEvidenciaRepository();
