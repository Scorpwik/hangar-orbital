# Spec 01 · Flota y misiones

Spec técnica de **HU-1.1 · Registrar nave** y **HU-1.3 · Asignar misión**. Fuente: `docs/backlog/E1-flota-y-misiones.md` y `docs/prd/hangar-mvp.md`.

Todavía no se escribe código fuera de este documento. La implementación sigue los tickets T-01…T-07.

---

## 1. Base de datos (Supabase)

Migración: `supabase/migraciones/001_hangar.sql`.

```sql
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
```

**Notas:**

- No hay políticas de `update` ni `delete` para `anon` en este sprint.
- Al insertar una nave, `ultima_revision` y `created_at` usan `now()` si no se envían: la nave recién registrada cuenta como revisada en su fecha de registro.
- Asignar una misión no actualiza `combustible` ni ninguna otra columna de `naves`.

---

## 2. Tipos TypeScript

Archivo: `src/types/hangar.ts` (o equivalente bajo `src/types/`).

```ts
export type ClaseNave = 'exploradora' | 'carguera' | 'transporte';

export type Nave = {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number; // 0..100
  enReparacion: boolean;
  ultimaRevision: string; // ISO timestamptz
  createdAt: string; // ISO timestamptz
};

export type Mision = {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD
  duracionDias: number; // entero >= 1
  createdAt: string; // ISO timestamptz
};

/** Datos de alta de nave (sin id ni timestamps). */
export type DatosNave = {
  nombre: string;
  clase: ClaseNave;
  combustible: number;
};

/** Datos de alta de misión (sin id ni createdAt). */
export type DatosMision = {
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD
  duracionDias: number;
};

export type ResultadoValidacion =
  | { ok: true }
  | { ok: false; motivo: string };

export type ResultadoPuedeRecibir =
  | { puede: true }
  | { puede: false; motivo: string };
```

Mapeo DB → dominio: `en_reparacion` → `enReparacion`, `ultima_revision` → `ultimaRevision`, `nave_id` → `naveId`, etc. Los servicios hacen ese mapeo; los componentes y el dominio usan camelCase.

---

## 3. Funciones puras (`src/dominio/`)

### `validarNave(datos: DatosNave, nombresExistentes: string[]): ResultadoValidacion`

Reglas:

- `nombre` obligatorio (no vacío tras trim).
- `clase` debe ser exactamente `exploradora`, `carguera` o `transporte`.
- `combustible` obligatorio: entero entre 0 y 100 inclusive.
- El `nombre` (tras trim) no debe estar en `nombresExistentes` (comparación case-sensitive según el unique de BD; el dominio recibe la lista ya cargada).

No toca base de datos. No asigna `ultimaRevision`: eso lo hace el insert con default `now()`.

### `validarMision(datos: DatosMision, hoy: string): ResultadoValidacion`

`hoy` es la fecha de hoy en `YYYY-MM-DD` (inyectada para poder testear).

Reglas:

- `naveId`, `destino`, `fechaDespegue` y `duracionDias` obligatorios (`destino` no vacío tras trim; `naveId` no vacío).
- `fechaDespegue` no puede ser anterior a `hoy`; `hoy` sí se permite.
- `duracionDias` debe ser un número entero ≥ 1.

### `puedeRecibirMision(nave: Pick<Nave, 'combustible' | 'enReparacion'>, misionesDesdeUltimaRevision: number): ResultadoPuedeRecibir`

Tres rechazos (en este orden sugerido al evaluar):

1. Si `nave.enReparacion` → `{ puede: false, motivo: '...' }` (dique seco).
2. Si `misionesDesdeUltimaRevision >= 3` → `{ puede: false, motivo: '...' }`.
3. Si `nave.combustible < 25` → `{ puede: false, motivo: '...' }` (poco combustible; con exactamente 25 % sí puede).

Si ninguno aplica → `{ puede: true }`.

**Nota:** el PRD separa “apta para despegar” de “recibir misión”; en esta spec, `puedeRecibirMision` concentra los tres bloqueos operativos del sprint (reparación, tope 3, combustible &lt; 25) para que el servicio de creación los aplique antes del insert.

---

## 4. Servicios (`src/services/`)

Los componentes **no** llaman a Supabase; solo estos servicios.

### `navesService`

- `listar(): Promise<Nave[]>` — `select` de todas las naves, mapeadas a `Nave`.
- `crear(datos: DatosNave): Promise<Nave>` —
  1. Obtiene nombres existentes (`listar` o consulta de nombres).
  2. Llama `validarNave`; si falla, lanza/rechaza con el `motivo` (sin insert).
  3. Inserta en `naves` (sin enviar `ultima_revision`: default `now()`).
  4. Devuelve la nave creada mapeada.

### `misionesService`

- `contarDesdeUltimaRevision(nave: Nave): Promise<number>` — cuenta filas en `misiones` con `nave_id = nave.id` y `created_at >= nave.ultimaRevision` (todas las asignadas desde la última revisión, realizadas o programadas).
- `crear(datos: DatosMision, nave: Nave, hoy: string): Promise<Mision>` —
  1. `validarMision(datos, hoy)`; si falla, no inserta.
  2. `contarDesdeUltimaRevision(nave)`.
  3. `puedeRecibirMision(nave, conteo)`; si no puede, no inserta.
  4. Inserta en `misiones` **sin** actualizar `naves.combustible` ni otras columnas de la nave.
  5. Devuelve la misión creada.

Cliente Supabase: `src/lib/supabase.ts` (solo URL + clave anon/publishable desde `import.meta.env`; nunca `service_role`).

---

## 5. Componentes (`src/components/`)

### `FormularioNave`

Campos: nombre (texto), clase (select: exploradora / carguera / transporte), combustible (número 0–100).

Al enviar: llama `navesService.crear`. Éxito → limpia o notifica y refresca la lista. Error → muestra el mensaje al jefe de hangar.

**Mensajes de error (jefe de hangar):**

| Situación | Mensaje |
| --- | --- |
| Falta nombre, clase o combustible | «Completa nombre, clase y combustible.» |
| Nombre ya existe | «Ya hay una nave con ese nombre.» |
| Clase no permitida | «La clase debe ser exploradora, carguera o transporte.» |
| Combustible fuera de 0–100 o no entero | «El combustible debe ser un entero entre 0 y 100.» |
| Error de red / Supabase | «No se pudo registrar la nave. Inténtalo de nuevo.» |

### `ListaNaves`

Lista las naves de `navesService.listar()` (nombre, clase, combustible, si está en reparación). Vacío: «Aún no hay naves en la flota.»

Sirve para comprobar que un alta válida aparece y que un rechazo no cambia la flota.

### `FormularioMision`

Campos: nave (select de la flota), destino, fecha de despegue, duración en días.

Al enviar: obtiene la nave elegida, llama `misionesService.crear` con la fecha de hoy. Éxito → confirma y refresca lo necesario. Error → mensaje visible.

**Mensajes de error (jefe de hangar):**

| Situación | Mensaje |
| --- | --- |
| Falta nave, destino, fecha o duración | «Completa nave, destino, fecha de despegue y duración.» |
| Fecha de despegue anterior a hoy | «La fecha de despegue no puede ser anterior a hoy.» |
| Duración no entera o &lt; 1 | «La duración debe ser un número entero de al menos 1 día.» |
| Nave en reparación | «Esa nave está en dique seco y no puede recibir misiones.» |
| Ya tiene 3 misiones desde la última revisión | «Esa nave ya tiene 3 misiones desde su última revisión.» |
| Combustible &lt; 25 % | «Esa nave no tiene combustible suficiente (mínimo 25 %).» |
| Error de red / Supabase | «No se pudo asignar la misión. Inténtalo de nuevo.» |

Tras una asignación exitosa, el combustible mostrado de la nave **no** cambia.

**Punto abierto (no se implementa en esta spec):** dos misiones de la misma nave con fechas superpuestas.

---

## 6. Criterios de aceptación (DEBE / NO DEBE)

### HU-1.1 · Registrar nave

| Id | Criterio |
| --- | --- |
| **CA-1.1.1** | El sistema **DEBE** registrar una nave con nombre, clase y combustible válidos y **DEBE** mostrarla en la flota disponible para misiones. |
| **CA-1.1.2** | El sistema **NO DEBE** aceptar el registro si faltan nombre, clase o combustible, y la flota **NO DEBE** cambiar. |
| **CA-1.1.3** | El sistema **NO DEBE** aceptar una nave cuyo nombre ya exista en la flota. |
| **CA-1.1.4** | El sistema **DEBE** aceptar solo las clases exploradora, carguera o transporte; **NO DEBE** aceptar cualquier otra. |
| **CA-1.1.5** | Una nave recién registrada **DEBE** contar como revisada en la fecha de registro (sin misiones previas hacia el tope de 3). |

### HU-1.3 · Asignar misión

| Id | Criterio |
| --- | --- |
| **CA-1.3.1** | El sistema **DEBE** asociar a la nave una misión con nave, destino, fecha de despegue y duración válidos cuando la nave no está en reparación y tiene menos de 3 misiones desde su última revisión (y combustible ≥ 25), y la misión **DEBE** ser visible al consultarla. |
| **CA-1.3.2** | El sistema **NO DEBE** aceptar la misión si faltan nave, destino, fecha de despegue o duración. |
| **CA-1.3.3** | El sistema **NO DEBE** aceptar una fecha de despegue anterior a hoy; **DEBE** aceptar la fecha de hoy si el resto de datos es válido. |
| **CA-1.3.4** | El sistema **NO DEBE** aceptar una duración que no sea entero ≥ 1. |
| **CA-1.3.5** | El sistema **NO DEBE** aceptar otra misión si la nave ya tiene 3 desde su última revisión, y la nave **DEBE** seguir con esas 3. |
| **CA-1.3.6** | El sistema **NO DEBE** aceptar una misión si la nave está en reparación (dique seco). |
| **CA-1.3.7** | Tras una asignación exitosa, el combustible de la nave **NO DEBE** cambiar. |
| **CA-1.3.8** | Las misiones de una nave recién registrada **DEBEN** contar desde la revisión inicial (fecha de registro) hacia el tope de 3. |

---

## 7. Criterio → verificación

| Criterio | Verificación |
| --- | --- |
| CA-1.1.1 | Test Vitest: `validarNave` con datos válidos → `ok`. Manual: registrar en el navegador y ver la nave en `ListaNaves`. |
| CA-1.1.2 | Test Vitest: `validarNave` sin nombre / sin clase / sin combustible → `ok: false`. Manual: enviar formulario incompleto; la flota no cambia. |
| CA-1.1.3 | Test Vitest: `validarNave` con nombre en `nombresExistentes` → rechazo. Manual: intentar duplicar nombre. |
| CA-1.1.4 | Test Vitest: clase inválida → rechazo; las tres clases válidas → `ok`. |
| CA-1.1.5 | Test Vitest: regla de dominio / comentario de contrato (nueva nave sin misiones previas). Manual: nave nueva admite hasta 3 misiones desde el alta. |
| CA-1.3.1 | Test Vitest: `validarMision` + `puedeRecibirMision` con nave apta y conteo &lt; 3 → puede. Manual: asignar y ver la misión asociada. |
| CA-1.3.2 | Test Vitest: `validarMision` con campos faltantes → rechazo. Manual: formulario incompleto. |
| CA-1.3.3 | Test Vitest: `validarMision` con fecha &lt; `hoy` → rechazo; con `hoy` → `ok`. |
| CA-1.3.4 | Test Vitest: duración 0, decimal o negativo → rechazo; entero ≥ 1 → `ok`. |
| CA-1.3.5 | Test Vitest: `puedeRecibirMision` con conteo 3 → no puede. Manual: cuarta misión rechazada; siguen 3. |
| CA-1.3.6 | Test Vitest: `puedeRecibirMision` con `enReparacion: true` → no puede. |
| CA-1.3.7 | Manual: anotar combustible, asignar misión con éxito, comprobar que el valor no cambia. (Dominio: asignar no muta combustible.) |
| CA-1.3.8 | Manual / integración de servicio: misiones creadas tras el alta cuentan desde `ultima_revision` del registro. Test Vitest: con conteo 0…2 puede; con 3 no. |
| Combustible &lt; 25 en `puedeRecibirMision` | Test Vitest: combustible 24 → no puede; 25 → puede (si no hay otros bloqueos). |

Los tests de dominio van en `src/dominio/*.test.ts` (Vitest), **sin** base de datos.

---

## 8. Ticket → archivos

| Ticket | Archivos que crea o modifica |
| --- | --- |
| **T-01** · Configuración | `package.json` (dependencia `@supabase/supabase-js`; script `test` si aún no está), `src/lib/supabase.ts`, `.env.example` (`VITE_SUPABASE_URL=`, `VITE_SUPABASE_ANON_KEY=` vacíos). **No** crear ni editar `.env` / `.env.local` desde el agente. |
| **T-02** · Dominio registro | `src/types/hangar.ts` (tipos `Nave`, `DatosNave`, etc.), `src/dominio/validarNave.ts` |
| **T-03** · Datos/UI registro | `supabase/migraciones/001_hangar.sql`, `src/services/navesService.ts`, `src/components/FormularioNave.tsx`, `src/components/ListaNaves.tsx`, cableado en `src/App.tsx` (o equivalente) |
| **T-04** · Test registro | `src/dominio/validarNave.test.ts` |
| **T-05** · Dominio asignación | `src/types/hangar.ts` (tipos `Mision`, `DatosMision` si no estaban), `src/dominio/validarMision.ts`, `src/dominio/puedeRecibirMision.ts` |
| **T-06** · Datos/UI asignación | `src/services/misionesService.ts`, `src/components/FormularioMision.tsx`, ajustes en `ListaNaves` / `App` si hace falta para elegir nave y ver resultado |
| **T-07** · Test asignación | `src/dominio/validarMision.test.ts`, `src/dominio/puedeRecibirMision.test.ts` |

**Orden de ejecución:** T-01 → T-02 → T-04 (en paralelo posible con T-03) → T-03 → T-05 → T-07 (en paralelo posible con T-06) → T-06.
