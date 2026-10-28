# Auditoría · Spec 01 Flota y misiones

Fecha: 2026-10-28.

Comandos ejecutados:

- `npm test` → 3 archivos, **16 tests passed**
- `npm run build` → **OK** (`tsc -b && vite build`)

`docs/VERIFICACION.md` existe, pero la columna **resultado obtenido** está vacía en todas las filas; por eso los criterios de navegador quedan como **sin verificar** hasta que se complete esa columna.

## Criterios

| Criterio | Cómo se verificó | Resultado | Evidencia |
| --- | --- | --- | --- |
| CA-1.1.1 · Alta válida | Test + navegador | cumple (test) / sin verificar (navegador) | `validarNave.test.ts` («acepta una nave válida»); VERIFICACION fila CA-1.1.1 sin resultado obtenido |
| Combustible 120 % | Test + navegador | cumple (test) / sin verificar (navegador) | `validarNave.test.ts` («rechaza combustible fuera de rango»); VERIFICACION sin resultado obtenido |
| CA-1.1.2 · Datos incompletos | Test + navegador | cumple (test) / sin verificar (navegador) | `validarNave.test.ts` («rechaza datos incompletos») |
| CA-1.1.3 · Nombre repetido | Test + navegador | cumple (test) / sin verificar (navegador) | `validarNave.test.ts` («rechaza nombre repetido») |
| CA-1.1.4 · Clases | Test + navegador | cumple (test) / sin verificar (navegador) | `validarNave.test.ts` (tres clases + clase inválida) |
| CA-1.1.5 · Revisada al registrar | Diseño + navegador | cumple (diseño/migración) / sin verificar (navegador) | Default `ultima_revision = now()` en `001_hangar.sql`; insert no envía `ultima_revision` |
| CA-1.3.1 · Misión válida | Test + navegador | cumple (test) / sin verificar (navegador) | `validarMision` + `puedeRecibirMision` tests de caso feliz |
| Combustible 10 % (rechazo) | Test + navegador | cumple (test) / sin verificar (navegador) | `puedeRecibirMision.test.ts` (combustible &lt; 25) |
| Combustible 25 % (aceptación) | Test + navegador | cumple (test) / sin verificar (navegador) | `puedeRecibirMision.test.ts` («exactamente 25 %») |
| CA-1.3.2 · Misión incompleta | Test + navegador | cumple (test) / sin verificar (navegador) | `validarMision.test.ts` («rechaza datos incompletos») |
| CA-1.3.3 · Fecha ayer / hoy | Test + navegador | cumple (test) / sin verificar (navegador) | `validarMision.test.ts` (fecha anterior; fecha hoy) |
| CA-1.3.4 · Duración 0 | Test + navegador | cumple (test) / sin verificar (navegador) | `validarMision.test.ts` («rechaza duración inválida») |
| CA-1.3.5 · Tope 3 / cuarta misión | Test + navegador | cumple (test) / sin verificar (navegador) | `puedeRecibirMision.test.ts` (conteo 3) |
| CA-1.3.6 · En reparación | Test + navegador | cumple (test) / sin verificar (navegador) | `puedeRecibirMision.test.ts` («rechaza nave en reparación») |
| CA-1.3.7 · Combustible no cambia | Código servicio + navegador | cumple (código) / sin verificar (navegador) | `misionesService.crear` solo inserta en `misiones`; no actualiza `naves` |
| CA-1.3.8 · Contador desde alta | Diseño + tests de tope | cumple (diseño/test parcial) / sin verificar (navegador) | Conteos desde `ultimaRevision`; tests de tope 0…2 vs 3 |

## Resumen

| Ámbito | Resultado |
| --- | --- |
| Dominio (Vitest) | Cumple — 16/16 |
| Build | Cumple |
| Navegador (`VERIFICACION.md`) | Sin verificar — columna resultado obtenido vacía |
| Tickets T-01…T-07 | Hechos en código (ver backlog) |

## Riesgos conocidos

- Las políticas RLS permiten leer e insertar a cualquiera que tenga la clave pública, porque el MVP no tiene usuarios.
