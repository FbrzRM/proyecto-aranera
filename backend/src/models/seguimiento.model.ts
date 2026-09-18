import { model, Schema } from "mongoose";
import { estadosCaso } from "../domain/caso";
import { accionesSeguimiento } from "../domain/seguimiento";

const seguimientoSchema = new Schema(
  {
    casoId: { type: String, required: true, index: true },
    accion: { type: String, enum: accionesSeguimiento, required: true },
    descripcion: { type: String, required: true },
    autorId: { type: String, required: true },
    estado: { type: String, enum: [...estadosCaso, null], default: null }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SeguimientoModel = model("Seguimiento", seguimientoSchema);
