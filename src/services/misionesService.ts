import { puedeRecibirMision } from '../dominio/puedeRecibirMision';
import { validarMision } from '../dominio/validarMision';
import { supabase } from '../lib/supabase';
import type { DatosMision, Mision, Nave } from '../types/hangar';

type MisionRow = {
  id: string;
  nave_id: string;
  destino: string;
  fecha_despegue: string;
  duracion_dias: number;
  created_at: string;
};

function mapearMision(row: MisionRow): Mision {
  return {
    id: row.id,
    naveId: row.nave_id,
    destino: row.destino,
    fechaDespegue: row.fecha_despegue,
    duracionDias: row.duracion_dias,
    createdAt: row.created_at,
  };
}

export async function contarDesdeUltimaRevision(nave: Nave): Promise<number> {
  const { count, error } = await supabase
    .from('misiones')
    .select('id', { count: 'exact', head: true })
    .eq('nave_id', nave.id)
    .gte('created_at', nave.ultimaRevision);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function crear(
  datos: DatosMision,
  nave: Nave,
  hoy: string,
): Promise<Mision> {
  const validacion = validarMision(
    {
      naveId: datos.naveId.trim(),
      destino: datos.destino.trim(),
      fechaDespegue: datos.fechaDespegue.trim(),
      duracionDias: datos.duracionDias,
    },
    hoy,
  );

  if (!validacion.ok) {
    throw new Error(validacion.motivo);
  }

  const conteo = await contarDesdeUltimaRevision(nave);
  const aptitud = puedeRecibirMision(nave, conteo);

  if (!aptitud.puede) {
    throw new Error(aptitud.motivo);
  }

  const { data, error } = await supabase
    .from('misiones')
    .insert({
      nave_id: datos.naveId.trim(),
      destino: datos.destino.trim(),
      fecha_despegue: datos.fechaDespegue.trim(),
      duracion_dias: datos.duracionDias,
    })
    .select('id, nave_id, destino, fecha_despegue, duracion_dias, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapearMision(data as MisionRow);
}

export const misionesService = { contarDesdeUltimaRevision, crear };
