import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import mongoose, { InsertManyOptions } from "mongoose";
import { connectDatabase } from "../config/db";
import { CasoModel } from "../models/caso.model";
import { EvidenciaModel } from "../models/evidencia.model";
import { SeguimientoModel } from "../models/seguimiento.model";
import { TerceroModel } from "../models/tercero.model";
import { UserModel } from "../models/user.model";

function dias(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function upsertUsuario(email: string, nombre: string, role: string): Promise<string> {
  const passwordHash = bcrypt.hashSync("Clave123", 10);
  const doc = await UserModel.findOneAndUpdate(
    { email },
    { $set: { nombre, role, activo: true }, $setOnInsert: { email, passwordHash } },
    { new: true, upsert: true }
  );
  return String(doc?._id);
}

async function crearTercero(nombre: string): Promise<{ nombre: string; clientId: string; clientSecret: string }> {
  const clientId = `arn_${randomBytes(9).toString("hex")}`;
  const clientSecret = randomBytes(24).toString("hex");
  await TerceroModel.create({
    nombre,
    clientId,
    secretHash: bcrypt.hashSync(clientSecret, 10),
    activo: true
  });
  return { nombre, clientId, clientSecret };
}

const pathPedido = ["creado", "recibido", "asignado", "despachando", "empacando", "enviado", "cerrado"];
const pathGestion = ["creado", "recibido", "asignado", "cerrado"];

interface CasoDemo {
  tipo: "pedido" | "reclamo" | "requerimiento";
  categoria: "equipo" | "consumible" | "reactivo";
  titulo: string;
  descripcion: string;
  clienteId: string;
  responsableId: string | null;
  estado: string;
  plazo: Date;
  pagado?: boolean;
  evidencia?: { nombre: string; url: string; descripcion: string };
}

async function crearCaso(def: CasoDemo) {
  const caso = await CasoModel.create({
    tipo: def.tipo,
    categoria: def.categoria,
    titulo: def.titulo,
    descripcion: def.descripcion,
    clienteId: def.clienteId,
    responsableId: def.responsableId,
    estado: def.estado,
    plazo: def.plazo,
    pagado: def.pagado ?? false
  });

  const path = def.tipo === "pedido" ? pathPedido : pathGestion;
  const pasos = path.slice(0, path.indexOf(def.estado) + 1);
  const inicio = Date.now() - pasos.length * 86400000;

  const seguimientos = pasos.map((estado, i) => ({
    casoId: caso.id,
    accion: i === 0 ? "creado" : "estado",
    descripcion: i === 0 ? `Caso creado (${def.tipo}/${def.categoria})` : `Estado cambiado a ${estado}`,
    autorId: i === 0 ? def.clienteId : def.responsableId ?? def.clienteId,
    estado,
    createdAt: new Date(inicio + i * 86400000)
  }));

  if (def.pagado) {
    seguimientos.push({
      casoId: caso.id,
      accion: "pago",
      descripcion: "Pago registrado",
      autorId: def.clienteId,
      estado: null as unknown as string,
      createdAt: new Date()
    });
  }

  await SeguimientoModel.insertMany(seguimientos, { timestamps: false } as unknown as InsertManyOptions);

  if (def.evidencia) {
    await EvidenciaModel.create({
      casoId: caso.id,
      nombre: def.evidencia.nombre,
      url: def.evidencia.url,
      descripcion: def.evidencia.descripcion,
      autorId: def.responsableId ?? def.clienteId
    });
  }
}

async function main() {
  await connectDatabase();

  const juan = await upsertUsuario("cliente1@araneda.cl", "Juan Perez", "cliente");
  const laura = await upsertUsuario("laura@araneda.cl", "Laura Soto", "cliente");
  const pedro = await upsertUsuario("pedro@araneda.cl", "Pedro Diaz", "cliente");
  const marta = await upsertUsuario("empleado1@araneda.cl", "Marta Rojas", "empleado");
  const jose = await upsertUsuario("jose@araneda.cl", "Jose Vega", "empleado");
  await upsertUsuario("jefe@araneda.cl", "Carla Nunez", "jefatura");

  await Promise.all([CasoModel.deleteMany({}), SeguimientoModel.deleteMany({}), EvidenciaModel.deleteMany({}), TerceroModel.deleteMany({})]);

  const terceros = [await crearTercero("LabExterno SpA"), await crearTercero("BioDistribuidora Andina")];

  const casos: CasoDemo[] = [
    { tipo: "pedido", categoria: "equipo", titulo: "Compra de centrifuga", descripcion: "Centrifuga para laboratorio clinico", clienteId: laura, responsableId: null, estado: "creado", plazo: dias(53) },
    { tipo: "pedido", categoria: "consumible", titulo: "Guantes de nitrilo", descripcion: "20 cajas talla M", clienteId: laura, responsableId: marta, estado: "recibido", plazo: dias(5) },
    { tipo: "pedido", categoria: "reactivo", titulo: "Reactivo PCR", descripcion: "Kit de reactivos para PCR", clienteId: juan, responsableId: marta, estado: "asignado", plazo: dias(4) },
    { tipo: "pedido", categoria: "equipo", titulo: "Microscopio binocular", descripcion: "Microscopio con objetivos 4x-100x", clienteId: pedro, responsableId: jose, estado: "despachando", plazo: dias(40) },
    { tipo: "pedido", categoria: "consumible", titulo: "Tubos de ensayo", descripcion: "500 tubos de vidrio", clienteId: juan, responsableId: jose, estado: "empacando", plazo: dias(3), pagado: true },
    { tipo: "pedido", categoria: "equipo", titulo: "Autoclave 50L", descripcion: "Autoclave vertical automatico", clienteId: laura, responsableId: marta, estado: "enviado", plazo: dias(30), pagado: true, evidencia: { nombre: "guia_despacho.pdf", url: "https://archivos.araneda.cl/ev/guia-1.pdf", descripcion: "Guia de despacho" } },
    { tipo: "pedido", categoria: "consumible", titulo: "Placas Petri", descripcion: "Cajas de placas esteriles", clienteId: pedro, responsableId: jose, estado: "cerrado", plazo: dias(-2), pagado: true, evidencia: { nombre: "recepcion.jpg", url: "https://archivos.araneda.cl/ev/recepcion.jpg", descripcion: "Foto de recepcion conforme" } },
    { tipo: "reclamo", categoria: "reactivo", titulo: "Reactivo llego vencido", descripcion: "El lote entregado estaba vencido", clienteId: juan, responsableId: marta, estado: "asignado", plazo: dias(5) },
    { tipo: "requerimiento", categoria: "equipo", titulo: "Cotizacion de balanza", descripcion: "Solicitan cotizacion de balanza analitica", clienteId: laura, responsableId: jose, estado: "recibido", plazo: dias(6) },
    { tipo: "pedido", categoria: "reactivo", titulo: "Buffer fosfato", descripcion: "Buffer PBS 10x", clienteId: pedro, responsableId: marta, estado: "asignado", plazo: dias(-3) },
    { tipo: "pedido", categoria: "equipo", titulo: "Centrifuga refrigerada", descripcion: "Pedido urgente con retraso", clienteId: juan, responsableId: jose, estado: "despachando", plazo: dias(-5), evidencia: { nombre: "cotizacion.pdf", url: "https://archivos.araneda.cl/ev/cotizacion.pdf", descripcion: "Cotizacion aprobada" } },
    { tipo: "reclamo", categoria: "consumible", titulo: "Guantes rotos", descripcion: "Parte del lote llego dañado", clienteId: laura, responsableId: marta, estado: "cerrado", plazo: dias(-10) }
  ];

  for (const caso of casos) {
    await crearCaso(caso);
  }

  const totalCasos = await CasoModel.countDocuments();
  const totalSeg = await SeguimientoModel.countDocuments();
  const totalEv = await EvidenciaModel.countDocuments();
  console.log(`Datos de muestra creados: ${totalCasos} casos, ${totalSeg} seguimientos, ${totalEv} evidencias, ${terceros.length} terceros`);
  console.log("Empleados: empleado1@araneda.cl (Marta), jose@araneda.cl (Jose) | Jefatura: jefe@araneda.cl | Clientes: cliente1, laura, pedro @araneda.cl | Clave: Clave123");
  for (const tercero of terceros) {
    console.log(`Tercero: ${tercero.nombre} | clientId: ${tercero.clientId} | clientSecret: ${tercero.clientSecret}`);
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error al sembrar datos de muestra", error);
  process.exit(1);
});
