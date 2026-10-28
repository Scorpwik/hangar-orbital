# Épicas — Hangar Orbital (MVP)

## E1 · Flota y misiones

**Objetivo:** Registrar las naves de la flota, consultarlas y asignarles misiones.

**Puntos del alcance que cubre:**
1. Registrar cada nave de la flota.
2. Asignar misiones a las naves.

**Reglas de negocio que aplican:**
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Asignar una misión no cambia el combustible: se actualiza a mano.
- Una nave en dique seco no puede recibir misiones.

## E2 · Mantenimiento

**Objetivo:** Saber qué naves no están aptas para despegar, registrar revisiones y combustible, y manejar la reparación en dique seco.

**Puntos del alcance que cubre:**
3. Consultar en todo momento qué naves están aptas para despegar.
4. Marcar naves en dique seco para que no reciban misiones mientras estén en reparación.

**Reglas de negocio que aplican:**
- Una nave está apta si tiene al menos 25 % de combustible y no supera el tope de misiones entre revisiones.
- El combustible es un porcentaje entero de 0 a 100. Con exactamente 25 % la nave está apta.
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Asignar una misión no cambia el combustible: se actualiza a mano.
- Una nave en dique seco no puede recibir misiones.

## Cobertura del alcance

Ningún punto del alcance del MVP quedó fuera de ambas épicas. Los cuatro puntos quedan cubiertos: 1 y 2 en E1; 3 y 4 en E2.
