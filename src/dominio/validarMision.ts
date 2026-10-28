import type { DatosMision, ResultadoValidacion } from '../types/hangar';

export function validarMision(
  datos: DatosMision,
  hoy: string,
): ResultadoValidacion {
  const destino = datos.destino.trim();
  const naveId = datos.naveId.trim();
  const fechaDespegue = datos.fechaDespegue.trim();

  if (
    !naveId ||
    !destino ||
    !fechaDespegue ||
    datos.duracionDias === undefined ||
    datos.duracionDias === null
  ) {
    return {
      ok: false,
      motivo: 'Completa nave, destino, fecha de despegue y duración.',
    };
  }

  if (fechaDespegue < hoy) {
    return {
      ok: false,
      motivo: 'La fecha de despegue no puede ser anterior a hoy.',
    };
  }

  if (
    typeof datos.duracionDias !== 'number' ||
    !Number.isInteger(datos.duracionDias) ||
    datos.duracionDias < 1
  ) {
    return {
      ok: false,
      motivo: 'La duración debe ser un número entero de al menos 1 día.',
    };
  }

  return { ok: true };
}
