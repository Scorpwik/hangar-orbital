import type { Nave, ResultadoPuedeRecibir } from '../types/hangar';

export function puedeRecibirMision(
  nave: Pick<Nave, 'combustible' | 'enReparacion'>,
  misionesDesdeUltimaRevision: number,
): ResultadoPuedeRecibir {
  if (nave.enReparacion) {
    return {
      puede: false,
      motivo: 'Esa nave está en dique seco y no puede recibir misiones.',
    };
  }

  if (misionesDesdeUltimaRevision >= 3) {
    return {
      puede: false,
      motivo: 'Esa nave ya tiene 3 misiones desde su última revisión.',
    };
  }

  if (nave.combustible < 25) {
    return {
      puede: false,
      motivo: 'Esa nave no tiene combustible suficiente (mínimo 25 %).',
    };
  }

  return { puede: true };
}
