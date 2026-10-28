# Verificación en navegador · Spec 01

Cómo usarla: con `npm run dev` abierto, recorre cada fila, sigue los pasos y rellena **resultado obtenido**. Comprueba también en el Table Editor de Supabase que las filas aparecen cuando el alta es válida.

| Criterio | Pasos | Resultado esperado | Resultado obtenido |
| --- | --- | --- | --- |
| CA-1.1.1 · Nave válida 80 % | Registrar nave (p. ej. «Aurora», exploradora, combustible **80**). Mirar la flota y la tabla `naves`. | La nave aparece en la flota y en Supabase. | |
| Combustible 120 % (rechazo) | Intentar registrar otra nave con combustible **120**. | Error de combustible; la flota no agrega esa nave. | |
| CA-1.1.2 · Datos incompletos | Enviar el formulario de nave dejando vacío nombre, clase o combustible. | Mensaje «Completa nombre, clase y combustible.»; flota sin cambios. | |
| CA-1.1.3 · Nombre repetido | Registrar de nuevo una nave con el mismo nombre que «Aurora». | Error «Ya hay una nave con ese nombre.»; no se duplica en la flota ni en BD. | |
| CA-1.1.4 · Clases permitidas | Registrar una nave con cada clase: exploradora, carguera, transporte. | Las tres se aceptan (nombres distintos). | |
| CA-1.1.5 / CA-1.3.8 · Revisión al registrar | Con una nave recién creada, asignar hasta 3 misiones válidas seguidas. | Las tres se aceptan; el contador parte de la fecha de registro. | |
| CA-1.3.1 · Misión válida | Elegir una nave apta (≥ 25 %, no en reparación, &lt; 3 misiones), destino, fecha de hoy, duración ≥ 1. | Misión creada, visible en la UI y en tabla `misiones`. | |
| Combustible 10 % (rechazo) | Registrar nave con combustible **10**. Intentar asignarle una misión válida. | Rechazo por combustible insuficiente (mínimo 25 %). No hay fila nueva de misión para esa nave. | |
| Combustible exactamente 25 % (aceptación) | Registrar nave con combustible **25**. Asignarle una misión válida. | La misión se acepta. | |
| CA-1.3.2 · Misión incompleta | Enviar formulario de misión sin nave, destino, fecha o duración. | Mensaje de completar campos; no se crea misión. | |
| CA-1.3.3 · Fecha de ayer | Asignar misión con fecha de despegue = **ayer**. | Rechazo: la fecha no puede ser anterior a hoy. | |
| CA-1.3.3 · Fecha hoy | Misma nave apta, fecha = **hoy**, resto válido. | La misión se acepta. | |
| CA-1.3.4 · Duración 0 | Asignar misión con duración **0**. | Rechazo: duración entero de al menos 1 día. | |
| CA-1.3.5 / CA-1.3.8 · Cuarta misión | Sobre una nave que ya tiene **3** misiones desde el alta, intentar una cuarta. | Rechazo por tope de 3; siguen solo esas 3 en BD. | |
| CA-1.3.6 · Nave en reparación | En Table Editor, poner `en_reparacion = true` en una nave. Recargar la app e intentar asignarle misión. | Rechazo por dique seco. | |
| CA-1.3.7 · Combustible no cambia | Anotar el % de una nave. Asignar una misión con éxito. Comparar el % en la flota y en `naves`. | El combustible es el mismo que antes. | |
