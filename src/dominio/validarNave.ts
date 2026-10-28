import type { ClaseNave, DatosNave, ResultadoValidacion } from '../types/hangar';

const CLASES_PERMITIDAS: readonly ClaseNave[] = [
  'exploradora',
  'carguera',
  'transporte',
];

function esClaseNave(valor: string): valor is ClaseNave {
  return (CLASES_PERMITIDAS as readonly string[]).includes(valor);
}

export function validarNave(
  datos: DatosNave,
  nombresExistentes: string[],
): ResultadoValidacion {
  const nombre = datos.nombre.trim();

  if (!nombre || !datos.clase || datos.combustible === undefined || datos.combustible === null) {
    return { ok: false, motivo: 'Completa nombre, clase y combustible.' };
  }

  if (!esClaseNave(datos.clase)) {
    return {
      ok: false,
      motivo: 'La clase debe ser exploradora, carguera o transporte.',
    };
  }

  if (
    typeof datos.combustible !== 'number' ||
    !Number.isInteger(datos.combustible) ||
    datos.combustible < 0 ||
    datos.combustible > 100
  ) {
    return {
      ok: false,
      motivo: 'El combustible debe ser un entero entre 0 y 100.',
    };
  }

  if (nombresExistentes.includes(nombre)) {
    return { ok: false, motivo: 'Ya hay una nave con ese nombre.' };
  }

  return { ok: true };
}
