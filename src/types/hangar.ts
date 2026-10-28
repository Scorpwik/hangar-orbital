export type ClaseNave = 'exploradora' | 'carguera' | 'transporte';

export type Nave = {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: string;
  createdAt: string;
};

export type Mision = {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
  createdAt: string;
};

export type DatosNave = {
  nombre: string;
  clase: ClaseNave;
  combustible: number;
};

export type DatosMision = {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
};

export type ResultadoValidacion =
  | { ok: true }
  | { ok: false; motivo: string };

export type ResultadoPuedeRecibir =
  | { puede: true }
  | { puede: false; motivo: string };
