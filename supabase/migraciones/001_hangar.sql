-- Clases permitidas para naves
create type clase_nave as enum ('exploradora', 'carguera', 'transporte');

-- Tabla naves
create table naves (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  clase clase_nave not null,
  combustible integer not null check (combustible >= 0 and combustible <= 100),
  en_reparacion boolean not null default false,
  ultima_revision timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Tabla misiones
create table misiones (
  id uuid primary key default gen_random_uuid(),
  nave_id uuid not null references naves (id),
  destino text not null,
  fecha_despegue date not null,
  duracion_dias integer not null check (duracion_dias >= 1),
  created_at timestamptz not null default now()
);

-- RLS: temporal — el MVP no tiene auth; anon lee e inserta para poder operar desde el frontend con la clave pública.
alter table naves enable row level security;
alter table misiones enable row level security;

create policy "anon_leer_naves"
  on naves for select
  to anon
  using (true);

create policy "anon_insertar_naves"
  on naves for insert
  to anon
  with check (true);

create policy "anon_leer_misiones"
  on misiones for select
  to anon
  using (true);

create policy "anon_insertar_misiones"
  on misiones for insert
  to anon
  with check (true);
