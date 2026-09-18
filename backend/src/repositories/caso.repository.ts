import { isValidObjectId } from "mongoose";
import { Caso, Categoria, EstadoCaso, TipoCaso } from "../domain/caso";
import { CasoModel } from "../models/caso.model";
import { Page } from "./user.repository";

export interface NewCaso {
  tipo: TipoCaso;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  clienteId: string;
  responsableId: string | null;
  estado: EstadoCaso;
  plazo: Date;
  pagado: boolean;
}

export interface CasoUpdate {
  responsableId?: string;
  estado?: EstadoCaso;
  pagado?: boolean;
}

export interface CasoFiltros {
  page: number;
  limit: number;
  estado?: EstadoCaso;
  tipo?: TipoCaso;
  responsableId?: string;
  clienteId?: string;
  vencidos?: boolean;
}

export interface CasoRepository {
  create(data: NewCaso): Promise<Caso>;
  findById(id: string): Promise<Caso | null>;
  list(filtros: CasoFiltros): Promise<Page<Caso>>;
  update(id: string, data: CasoUpdate): Promise<Caso | null>;
}

interface CasoDocument {
  _id: unknown;
  tipo: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  clienteId: string;
  responsableId: string | null;
  estado: string;
  plazo: Date;
  pagado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function toCaso(doc: CasoDocument): Caso {
  return {
    id: String(doc._id),
    tipo: doc.tipo as TipoCaso,
    categoria: doc.categoria as Categoria,
    titulo: doc.titulo,
    descripcion: doc.descripcion,
    clienteId: doc.clienteId,
    responsableId: doc.responsableId ?? null,
    estado: doc.estado as EstadoCaso,
    plazo: doc.plazo.toISOString(),
    pagado: doc.pagado,
    creadoEn: doc.createdAt.toISOString(),
    actualizadoEn: doc.updatedAt.toISOString()
  };
}

class MongoCasoRepository implements CasoRepository {
  async create(data: NewCaso): Promise<Caso> {
    const created = await CasoModel.create(data);
    return toCaso(created.toObject() as CasoDocument);
  }

  async findById(id: string): Promise<Caso | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    const doc = await CasoModel.findById(id).lean<CasoDocument>();
    return doc ? toCaso(doc) : null;
  }

  async list(filtros: CasoFiltros): Promise<Page<Caso>> {
    const query: Record<string, unknown> = {};
    if (filtros.tipo) {
      query.tipo = filtros.tipo;
    }
    if (filtros.responsableId) {
      query.responsableId = filtros.responsableId;
    }
    if (filtros.clienteId) {
      query.clienteId = filtros.clienteId;
    }
    if (filtros.vencidos) {
      query.plazo = { $lt: new Date() };
      query.estado = { $nin: ["cerrado", "cancelado"] };
    } else if (filtros.estado) {
      query.estado = filtros.estado;
    }

    const skip = (filtros.page - 1) * filtros.limit;
    const [docs, total] = await Promise.all([
      CasoModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(filtros.limit).lean<CasoDocument[]>(),
      CasoModel.countDocuments(query)
    ]);
    return { items: docs.map(toCaso), total };
  }

  async update(id: string, data: CasoUpdate): Promise<Caso | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    const doc = await CasoModel.findByIdAndUpdate(id, data, { new: true }).lean<CasoDocument>();
    return doc ? toCaso(doc) : null;
  }
}

export const casoRepository: CasoRepository = new MongoCasoRepository();
