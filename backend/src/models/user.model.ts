import { model, Schema } from "mongoose";
import { roles } from "../domain/roles";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    activo: { type: Boolean, required: true, default: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
