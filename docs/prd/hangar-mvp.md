# Mini-PRD — Hangar Orbital (MVP)

## 1. Problema

Hoy los jefes de hangar deciden de memoria qué nave despega. Eso ya provocó un despegue con el tanque casi vacío y otra nave que encadenó seis misiones sin pasar por revisión.

## 2. Usuarios

De 3 a 5 jefes de hangar del Centro de Comando Espacial. Todos operan con el mismo permiso.

## 3. Objetivo y métrica de éxito

Que en cualquier momento se sepa qué naves están aptas para despegar. Éxito: en un mes, cero despegues de naves no aptas.

## 4. Alcance del MVP

1. Registrar cada nave de la flota.
2. Asignar misiones a las naves.
3. Consultar en todo momento qué naves están aptas para despegar.
4. Marcar naves en dique seco para que no reciban misiones mientras estén en reparación.

## 5. No-alcance

Tripulación; usuarios e inicio de sesión; notificaciones; mapas o trayectorias; cálculo automático del consumo de combustible; app móvil.

## 6. Reglas de negocio

- Una nave está apta si tiene al menos 25 % de combustible y no supera el tope de misiones entre revisiones.
- El combustible es un porcentaje entero de 0 a 100. Con exactamente 25 % la nave está apta.
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Asignar una misión no cambia el combustible: se actualiza a mano.
- Una nave en dique seco no puede recibir misiones.

## 7. Supuestos

- [SUPUESTO] La app informa la aptitud; no registra ni bloquea el acto de despegue fuera del hangar.
- [SUPUESTO] El combustible lo actualiza un jefe de hangar cuando corresponde (carga o medición).
- [SUPUESTO] “Revisión” es un evento explícito que reinicia el contador de misiones desde esa fecha.
- [SUPUESTO] Dique seco implica no apta para despegar además de no poder recibir misiones.

## 8. Puntos abiertos

- ¿Quién y cómo registra la salida del dique seco y una revisión completada?
- ¿Hay que historiar misiones pasadas más allá del contador desde la última revisión?
- ¿Puede una nave tener dos misiones con fechas superpuestas?
