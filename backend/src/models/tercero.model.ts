import { model, Schema } from "mongoose";

const terceroSchema = new Schema(
  {
    nombre: { type: String, required: true },
    clientId: { type: String, required: true, unique: true },
    secretHash: { type: String, required: true },
    activo: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

export const TerceroModel = model("Tercero", terceroSchema);
