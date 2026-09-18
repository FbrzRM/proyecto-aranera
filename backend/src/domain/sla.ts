import { Categoria } from "./caso";

export interface SlaStrategy {
  plazoSemanas(): number;
}

class SlaEquipo implements SlaStrategy {
  plazoSemanas(): number {
    return 8;
  }
}

class SlaEstandar implements SlaStrategy {
  plazoSemanas(): number {
    return 1;
  }
}

const estrategias: Record<Categoria, SlaStrategy> = {
  equipo: new SlaEquipo(),
  consumible: new SlaEstandar(),
  reactivo: new SlaEstandar()
};

export function calcularPlazo(categoria: Categoria, desde: Date): Date {
  const semanas = estrategias[categoria].plazoSemanas();
  const plazo = new Date(desde);
  plazo.setDate(plazo.getDate() + semanas * 7);
  return plazo;
}
