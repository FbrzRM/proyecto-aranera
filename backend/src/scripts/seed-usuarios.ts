import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { CasoModel } from "../models/caso.model";
import { EvidenciaModel } from "../models/evidencia.model";
import { SeguimientoModel } from "../models/seguimiento.model";
import { UserModel } from "../models/user.model";

const nombres = [
  "Valentina Muñoz",
  "Benjamin Rojas",
  "Martina Diaz",
  "Mateo Soto",
  "Florencia Contreras",
  "Agustin Fuentes",
  "Isidora Morales",
  "Vicente Herrera",
  "Antonia Silva",
  "Tomas Vergara",
  "Josefa Castro",
  "Maximiliano Reyes",
  "Catalina Vega",
  "Sebastian Nuñez",
  "Emilia Gutierrez",
  "Diego Araya",
  "Fernanda Pizarro",
  "Joaquin Carrasco",
  "Camila Espinoza",
  "Lucas Tapia",
  "Javiera Fernandez",
  "Matias Bravo",
  "Trinidad Sandoval",
  "Felipe Cortes",
  "Constanza Rivera",
  "Ignacio Figueroa",
  "Amanda Salazar",
  "Gabriel Molina",
  "Sofia Campos",
  "Nicolas Miranda",
  "Paula Garrido",
  "Cristobal Vasquez",
  "Rocio Maldonado",
  "Daniel Peña"
];

const rolesDisponibles = ["administrador", "jefatura", "empleado", "cliente"] as const;

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}

function construirEmail(nombreCompleto: string, usados: Set<string>): string {
  const [nombre, ...resto] = nombreCompleto.split(" ");
  const apellido = resto[resto.length - 1] ?? "";
  const base = `${normalizar(nombre).charAt(0)}${normalizar(apellido)}`;
  let email = `${base}@araneda.com`;
  let contador = 1;
  while (usados.has(email)) {
    email = `${base}${contador}@araneda.com`;
    contador += 1;
  }
  usados.add(email);
  return email;
}

function rolPara(indice: number): (typeof rolesDisponibles)[number] {
  if (indice < 2) return "administrador";
  if (indice < 6) return "jefatura";
  return indice % 2 === 0 ? "empleado" : "cliente";
}

const inactivos = new Set([5, 12, 19, 26, 33]);

async function main() {
  await connectDatabase();

  await Promise.all([
    UserModel.deleteMany({}),
    CasoModel.deleteMany({}),
    SeguimientoModel.deleteMany({}),
    EvidenciaModel.deleteMany({})
  ]);

  const passwordHash = bcrypt.hashSync("Clave123", 10);
  const adminHash = bcrypt.hashSync("Admin123", 10);

  await UserModel.create({
    email: "admin@araneda.cl",
    nombre: "Administrador Araneda",
    role: "administrador",
    passwordHash: adminHash,
    activo: true
  });

  const usados = new Set<string>();
  const usuarios = nombres.map((nombre, indice) => ({
    email: construirEmail(nombre, usados),
    nombre,
    role: rolPara(indice),
    passwordHash,
    activo: !inactivos.has(indice)
  }));

  await UserModel.insertMany(usuarios);

  console.log(`Base limpiada. Creados ${usuarios.length} usuarios + 1 admin (admin@araneda.cl / Admin123).`);
  console.log("Contraseña de los 34 usuarios: Clave123");
  for (const usuario of usuarios) {
    console.log(`${usuario.email} | ${usuario.nombre} | ${usuario.role} | ${usuario.activo ? "activo" : "inactivo"}`);
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error al sembrar usuarios", error);
  process.exit(1);
});
