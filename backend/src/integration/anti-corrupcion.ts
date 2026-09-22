import { Caso, EstadoCaso } from "../domain/caso";
import { CrearCasoInput } from "../schemas/caso.schema";
import { CrearPedidoInput, PedidoExterno } from "../schemas/integracion.schema";

const estadoExterno: Record<EstadoCaso, string> = {
  creado: "recibido",
  recibido: "recibido",
  asignado: "recibido",
  despachando: "en_preparacion",
  empacando: "en_preparacion",
  pagado: "en_preparacion",
  enviado: "enviado",
  cerrado: "finalizado",
  cancelado: "cancelado"
};

export function aCrearCasoInput(input: CrearPedidoInput): CrearCasoInput {
  return {
    tipo: "pedido",
    categoria: input.categoria,
    titulo: input.producto,
    descripcion: input.detalle
  };
}

export function aPedidoExterno(caso: Caso): PedidoExterno {
  return {
    id: caso.id,
    producto: caso.titulo,
    detalle: caso.descripcion,
    categoria: caso.categoria,
    estado: estadoExterno[caso.estado],
    plazo: caso.plazo,
    pagado: caso.pagado,
    creadoEn: caso.creadoEn
  };
}
