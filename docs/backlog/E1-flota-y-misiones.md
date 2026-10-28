# E1 · Flota y misiones — Historias de usuario

## En alcance

### HU-1.1 · Registrar nave
Como jefe de hangar, quiero registrar una nave en la flota, para poder asignarle misiones después.

**Reglas del PRD que aplican:**
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- El combustible es un porcentaje entero de 0 a 100.

**Criterios de aceptación:**

1. **DADO** que el hangar aún no tiene esa nave en la flota, **CUANDO** el jefe de hangar la registra con nombre, clase y combustible, **ENTONCES** la nave aparece en la flota y queda disponible para recibir misiones.
2. **DADO** que se intenta registrar una nave sin nombre, sin clase o sin combustible, **CUANDO** el jefe de hangar confirma el registro, **ENTONCES** el sistema no la acepta y la flota no cambia.
3. **DADO** que ya existe una nave con un nombre en la flota, **CUANDO** el jefe de hangar intenta registrar otra con el mismo nombre, **ENTONCES** el sistema no la acepta.
4. **DADO** que el jefe de hangar elige la clase de la nave, **CUANDO** registra, **ENTONCES** solo puede ser exploradora, carguera o transporte; cualquier otra opción no se acepta.
5. **DADO** que una nave acaba de registrarse, **CUANDO** el jefe de hangar consulta su situación respecto a revisiones, **ENTONCES** cuenta como revisada en la fecha en que se registró (no arrastra misiones previas).

### HU-1.2 · Consultar flota
Como jefe de hangar, quiero consultar las naves registradas, para saber qué hay en el hangar en cualquier momento.

**Estado:** por refinar.

### HU-1.3 · Asignar misión
Como jefe de hangar, quiero asignar una misión a una nave, para planificar las salidas de la flota.

**Reglas del PRD que aplican:**
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Asignar una misión no cambia el combustible: se actualiza a mano.
- Una nave en dique seco no puede recibir misiones.
- Una nave recién registrada cuenta como revisada en su fecha de registro.

**Criterios de aceptación:**

1. **DADO** una nave que no está en reparación y tiene menos de 3 misiones desde su última revisión, **CUANDO** el jefe de hangar le asigna una misión con nave, destino, fecha de despegue y duración, **ENTONCES** la misión queda asociada a esa nave y es visible al consultarla.
2. **DADO** que falta la nave, el destino, la fecha de despegue o la duración, **CUANDO** el jefe de hangar intenta asignar la misión, **ENTONCES** el sistema no la acepta.
3. **DADO** una fecha de despegue anterior a hoy, **CUANDO** el jefe de hangar intenta asignar la misión, **ENTONCES** el sistema no la acepta. **DADO** que la fecha es hoy, **CUANDO** asigna con el resto de datos válidos, **ENTONCES** la misión se acepta.
4. **DADO** una duración que no es un número entero de días de al menos 1, **CUANDO** el jefe de hangar intenta asignar la misión, **ENTONCES** el sistema no la acepta.
5. **DADO** una nave que ya tiene 3 misiones asignadas desde su última revisión (realizadas o programadas), **CUANDO** el jefe de hangar intenta asignarle otra, **ENTONCES** el sistema no la acepta y la nave sigue con esas 3 misiones.
6. **DADO** una nave en reparación (dique seco), **CUANDO** el jefe de hangar intenta asignarle una misión, **ENTONCES** el sistema no la acepta.
7. **DADO** una nave con un nivel de combustible conocido, **CUANDO** se le asigna una misión con éxito, **ENTONCES** el combustible de la nave no cambia.
8. **DADO** una nave recién registrada (cuenta como revisada en su fecha de registro), **CUANDO** se le asignan misiones, **ENTONCES** esas misiones cuentan desde esa revisión inicial hacia el tope de 3.

**Punto abierto:** si una nave puede tener dos misiones con fechas superpuestas queda sin decidir (también anotado en el PRD).

### HU-1.4 · Consultar misiones de una nave
Como jefe de hangar, quiero ver las misiones asignadas a una nave desde su última revisión, para no superar el tope de tres misiones entre revisiones.

**Estado:** por refinar.

## Fuera de alcance

### HU-1.5 · Asignar tripulación
Como jefe de hangar, quiero asignar tripulación a una misión, para saber quién vuela en cada salida.
**Fuera de alcance:** el PRD excluye tripulación.

### HU-1.6 · Notificar asignación
Como jefe de hangar, quiero recibir una notificación al asignar una misión, para confirmar que quedó registrada.
**Fuera de alcance:** el PRD excluye notificaciones.

### HU-1.7 · Consumo automático de combustible
Como jefe de hangar, quiero que al asignar una misión se descuente el combustible estimado, para no actualizarlo a mano.
**Fuera de alcance:** el PRD excluye el cálculo automático del consumo y dice que el combustible se actualiza a mano.

## Tickets del sprint

### HU-1.1 · Registrar nave

#### T-01 · Configuración
**Historia:** HU-1.1 · **Tipo:** Configuración · **Estado:** hecho

Preparar el cliente de datos y la configuración mínima del proyecto para persistir la flota desde el frontend (sin definir aún el esquema concreto).

**Definition of Done:**
- [x] El cliente de datos queda disponible para los servicios
- [x] La configuración no incluye claves secretas en el código
- [x] `npm run build` sigue pasando

**Dependencias:** ninguna.

#### T-02 · Modelo/Dominio — registro de nave
**Historia:** HU-1.1 · **Tipo:** Modelo/Dominio · **Estado:** hecho

Definir en dominio las reglas puras de registro: datos obligatorios, nombre único (como regla comprobable), clases permitidas y que una nave nueva cuenta como revisada en su fecha de registro.

**Definition of Done:**
- [x] Existen funciones/tipos de dominio para validar el alta de una nave
- [x] Cubren los criterios de aceptación de HU-1.1 que no dependen de la pantalla
- [x] No se usa `any`

**Dependencias:** ninguna.

#### T-03 · Datos/Interfaz — registrar nave
**Historia:** HU-1.1 · **Tipo:** Datos/Interfaz · **Estado:** hecho

Conectar servicio e interfaz para que el jefe de hangar registre una nave válida y la vea en la flota; rechazar altas inválidas sin cambiar la flota.

**Definition of Done:**
- [x] El registro válido deja la nave visible en la flota
- [x] Los rechazos (obligatorios, nombre repetido, clase inválida) no alteran la flota
- [x] Los componentes no llaman a Supabase directamente (pasan por servicios)

**Dependencias:** T-01, T-02.

#### T-04 · Test — registro de nave
**Historia:** HU-1.1 · **Tipo:** Test · **Estado:** hecho

Probar las reglas de dominio de registro de nave según los criterios de HU-1.1.

**Definition of Done:**
- [x] Hay tests automatizados para alta válida, datos incompletos, nombre repetido y clase inválida
- [x] `npm test` pasa

**Dependencias:** T-02.

### HU-1.3 · Asignar misión

#### T-05 · Modelo/Dominio — asignación de misión
**Historia:** HU-1.3 · **Tipo:** Modelo/Dominio · **Estado:** hecho

Definir en dominio las reglas puras de asignación: datos obligatorios de la misión, fecha de despegue no anterior a hoy, duración entera ≥ 1, tope de 3 misiones desde la última revisión, bloqueo si la nave está en reparación, y que asignar no altera el combustible.

**Definition of Done:**
- [x] Existen funciones/tipos de dominio para validar la asignación
- [x] Cubren los criterios de HU-1.3 que no dependen de la pantalla
- [x] No se usa `any`

**Dependencias:** T-02.

#### T-06 · Datos/Interfaz — asignar misión
**Historia:** HU-1.3 · **Tipo:** Datos/Interfaz · **Estado:** hecho

Conectar servicio e interfaz para asignar una misión a una nave ya registrada y mostrar el resultado; rechazar asignaciones inválidas sin crear la misión.

**Definition of Done:**
- [x] Una asignación válida queda asociada a la nave y es visible
- [x] Se rechazan casos inválidos (datos incompletos, fecha pasada, duración inválida, tope 3, nave en reparación)
- [x] Tras una asignación exitosa el combustible de la nave no cambia
- [x] Los componentes no llaman a Supabase directamente

**Dependencias:** T-03, T-05.

#### T-07 · Test — asignación de misión
**Historia:** HU-1.3 · **Tipo:** Test · **Estado:** hecho

Probar las reglas de dominio de asignación de misión según los criterios de HU-1.3.

**Definition of Done:**
- [x] Hay tests para asignación válida y para cada rechazo principal (fecha, duración, tope 3, reparación, datos incompletos, combustible inalterado)
- [x] `npm test` pasa

**Dependencias:** T-05.

## Orden de ejecución sugerido

1. **T-01** — configuración de datos
2. **T-02** — dominio de nave
3. **T-04** — tests de registro (en paralelo posible con T-03)
4. **T-03** — datos/interfaz de registro
5. **T-05** — dominio de misión (depende de la nave)
6. **T-07** — tests de asignación (en paralelo posible con T-06)
7. **T-06** — datos/interfaz de asignación (depende de que ya se puedan registrar naves)

## Riesgos conocidos

- Las políticas RLS permiten leer e insertar a cualquiera que tenga la clave pública, porque el MVP no tiene usuarios.

