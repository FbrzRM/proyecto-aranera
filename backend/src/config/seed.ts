import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";

export async function seedAdminUser() {
  const existing = await UserModel.findOne({ email: "admin@araneda.cl" });
  if (existing) {
    return;
  }

  await UserModel.create({
    email: "admin@araneda.cl",
    nombre: "Administrador Araneda",
    role: "administrador",
    passwordHash: bcrypt.hashSync("Admin123", 10)
  });
}
