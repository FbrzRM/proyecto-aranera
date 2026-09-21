import { model, Schema } from "mongoose";

const evidenciaSchema = new Schema(
  {
    casoId: { type: String, required: true, index: true },
    nombre: { type: String, required: true },
    url: { type: String, required: true },
    descripcion: { type: String, default: null },
    autorId: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const EvidenciaModel = model("Evidencia", evidenciaSchema);
