# Hangar Orbital

## Proyecto

App web para registrar las naves de un hangar, asignarles misiones y saber cuáles pueden despegar.

## Stack

Vite + React + TypeScript, Supabase (`@supabase/supabase-js`), tests con Vitest, formato con Prettier.

## Estructura prevista

- `src/lib/supabase.ts`
- `src/types/`
- `src/dominio/` (funciones puras y sus tests)
- `src/services/`
- `src/components/`
- `supabase/migraciones/`
- `docs/prd/`, `docs/backlog/`, `docs/specs/`

## Comandos

- `npm run dev`
- `npm test`
- `npm run build`

## Convenciones

- Nombres del dominio en español.
- camelCase en TypeScript; snake_case en la base de datos.
- Nunca usar `any`.
- Los componentes no llaman a Supabase; solo los servicios de `src/services/`.

## Reglas

- Nunca leer ni modificar `.env` ni `.env.local`.
- Nunca escribir claves en el código.
- En el frontend solo va la clave pública (anon o publishable); nunca la `service_role`.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs`.
- Ejecutar `npm test` y `npm run build` antes de dar una tarea por terminada.
