import { validarNave } from '../dominio/validarNave';
import { supabase } from '../lib/supabase';
import type { ClaseNave, DatosNave, Nave } from '../types/hangar';

type NaveRow = {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  en_reparacion: boolean;
  ultima_revision: string;
  created_at: string;
};

function mapearNave(row: NaveRow): Nave {
  return {
    id: row.id,
    nombre: row.nombre,
    clase: row.clase,
    combustible: row.combustible,
    enReparacion: row.en_reparacion,
    ultimaRevision: row.ultima_revision,
    createdAt: row.created_at,
  };
}

export async function listar(): Promise<Nave[]> {
  const { data, error } = await supabase
    .from('naves')
    .select(
      'id, nombre, clase, combustible, en_reparacion, ultima_revision, created_at',
    )
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as NaveRow[] | null)?.map(mapearNave) ?? [];
}

export async function crear(datos: DatosNave): Promise<Nave> {
  const naves = await listar();
  const nombresExistentes = naves.map((n) => n.nombre);
  const validacion = validarNave(
    {
      nombre: datos.nombre.trim(),
      clase: datos.clase,
      combustible: datos.combustible,
    },
    nombresExistentes,
  );

  if (!validacion.ok) {
    throw new Error(validacion.motivo);
  }

  const { data, error } = await supabase
    .from('naves')
    .insert({
      nombre: datos.nombre.trim(),
      clase: datos.clase,
      combustible: datos.combustible,
    })
    .select(
      'id, nombre, clase, combustible, en_reparacion, ultima_revision, created_at',
    )
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya hay una nave con ese nombre.');
    }
    throw new Error(error.message);
  }

  return mapearNave(data as NaveRow);
}

export const navesService = { listar, crear };
