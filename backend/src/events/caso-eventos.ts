import { EstadoCaso } from "../domain/caso";
import { AccionSeguimiento } from "../domain/seguimiento";

export interface CasoEvento {
  casoId: string;
  accion: AccionSeguimiento;
  descripcion: string;
  autorId: string;
  estado: EstadoCaso | null;
}

export type Observador = (evento: CasoEvento) => Promise<void> | void;

export class CasoSubject {
  private readonly observadores: Observador[] = [];

  suscribir(observador: Observador): void {
    this.observadores.push(observador);
  }

  async notificar(evento: CasoEvento): Promise<void> {
    for (const observador of this.observadores) {
      await observador(evento);
    }
  }
}

export const casoEventos = new CasoSubject();
