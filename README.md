# Hangar Orbital

Aplicación web del Centro de Comando Espacial para registrar las naves de un hangar y asignarles misiones. Cada asignación respeta el combustible mínimo, el tope de tres misiones entre revisiones y el dique seco.

El código de esta entrega implementa la [spec 01](docs/specs/01-flota-y-misiones.md): registrar naves y asignar misiones. La épica E2 y las historias marcadas como «por refinar» quedan documentadas para un siguiente paso.

## Funcionalidades

- **Registrar una nave** con nombre, clase y combustible. El nombre es único en la flota. La clase es una de tres: exploradora, carguera o transporte. El combustible es un entero de 0 a 100. Al registrarla, queda como revisada en ese momento.
- **Ver la flota** que ya está guardada. Cada nave muestra su nombre, su clase, el porcentaje de combustible y, si corresponde, que está en reparación. Si el hangar está vacío, la pantalla indica: «Aún no hay naves en la flota.»
- **Asignar una misión** con nave, destino, fecha de despegue y duración en días. La fecha puede ser hoy o una posterior. La duración es un entero de al menos 1 día. El botón se habilita cuando ya hay naves en la flota.
- **Rechazar la misión** si la nave está en dique seco, si ya tiene 3 misiones asignadas desde su última revisión (realizadas o programadas), o si el combustible es menor a 25 %. Con exactamente 25 % la acepta, siempre que no haya otro motivo de rechazo.
- **Conservar el combustible** al asignar una misión. El porcentaje de la nave se mantiene igual.
- **Mostrar la misión aceptada** debajo del formulario mientras la página sigue abierta: nave, destino, fecha y días. La misión queda guardada en la base de datos.

Si faltan `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`, la aplicación avisa en pantalla y no abre los formularios.

## Tecnologías

- [Vite](https://vite.dev/) 7
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- [Vitest](https://vitest.dev/) 3, para las reglas de dominio, sin base de datos
- [Prettier](https://prettier.io/) 3

Los nombres del dominio van en español. En TypeScript se usa camelCase y en la base de datos, snake_case. Los componentes no llaman a Supabase: eso queda en `src/services/`.

## Instalación y ejecución

Necesitas Node.js 20.19 o superior, o Node.js 22.12 o superior (lo pide Vite 7), npm y un proyecto de Supabase.

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/Scorpwik/hangar-orbital.git
cd hangar-orbital
npm install
```

Copia el ejemplo de variables de entorno:

```bash
cp .env.example .env.local
```

Abre `.env.local` y completa la URL de tu proyecto y la clave pública:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

En el frontend solo va la clave `anon` o publishable. `.env.local` ya está en `.gitignore`.

En el SQL Editor de Supabase, ejecuta [`supabase/migraciones/001_hangar.sql`](supabase/migraciones/001_hangar.sql). El script crea las tablas `naves` y `misiones`, el tipo `clase_nave` y políticas de lectura e inserción para el rol `anon`. Quien tenga la clave pública puede leer e insertar; el detalle está en la [auditoría](docs/AUDITORIA.md).

Arranca la aplicación en tu computadora:

```bash
npm run dev
```

Abre la dirección que muestra la terminal. Con la configuración de Vite, suele ser `http://localhost:5173`. Si cambias `.env.local` con el servidor ya en marcha, deténlo y vuelve a ejecutar `npm run dev`: Vite lee esas variables al arrancar.

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Pruebas de dominio con Vitest |
| `npm run build` | Revisa los tipos y genera la versión de producción |
| `npm run preview` | Sirve en local la versión de producción |

## Estructura

- `src/dominio/`: reglas puras (`validarNave`, `validarMision`, `puedeRecibirMision`) y sus pruebas
- `src/services/`: lectura e inserción en Supabase
- `src/components/`: formulario de nave, lista de la flota y formulario de misión
- `src/lib/supabase.ts`: cliente con la clave pública
- `supabase/migraciones/001_hangar.sql`: tablas `naves` y `misiones`
- `docs/`: producto, backlog, spec, verificación y auditoría

## Documentación

El paso a paso del taller y los documentos del producto están en el repositorio:

- [Guía del estudiante — Taller «Hangar Orbital»](<Guía del estudiante — Taller «Hangar Orbital».md>)
- [Carpeta `docs/`](docs/)
- [Mini-PRD](docs/prd/hangar-mvp.md)
- [Épicas](docs/backlog/epicas.md)
- [Historias, criterios y tickets de E1](docs/backlog/E1-flota-y-misiones.md)
- [Spec 01 · Flota y misiones](docs/specs/01-flota-y-misiones.md)
- [Verificación en el navegador](docs/VERIFICACION.md)
- [Auditoría de la spec 01](docs/AUDITORIA.md)

Cada funcionalidad nueva parte de una spec en `docs/specs/`.

## Autor

Joshua Lozada ([Scorpwik](https://github.com/Scorpwik))
