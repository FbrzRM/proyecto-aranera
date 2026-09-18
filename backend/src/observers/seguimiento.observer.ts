import { casoEventos } from "../events/caso-eventos";
import { seguimientoRepository } from "../repositories/seguimiento.repository";

export function registrarObservadores(): void {
  casoEventos.suscribir(async (evento) => {
    await seguimientoRepository.create({
      casoId: evento.casoId,
      accion: evento.accion,
      descripcion: evento.descripcion,
      autorId: evento.autorId,
      estado: evento.estado
    });
  });
}
