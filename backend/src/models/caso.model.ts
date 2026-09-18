import { model, Schema } from "mongoose";
import { categorias, estadosCaso, tiposCaso } from "../domain/caso";

const casoSchema = new Schema(
  {
    tipo: { type: String, enum: tiposCaso, required: true },
    categoria: { type: String, enum: categorias, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    clienteId: { type: String, required: true },
    responsableId: { type: String, default: null },
    estado: { type: String, enum: estadosCaso, required: true, default: "creado" },
    plazo: { type: Date, required: true },
    pagado: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

export const CasoModel = model("Caso", casoSchema);
