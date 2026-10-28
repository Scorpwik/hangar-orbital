import { useEffect, useState } from 'react';
import { FormularioMision } from './components/FormularioMision';
import { FormularioNave } from './components/FormularioNave';
import { ListaNaves } from './components/ListaNaves';
import { supabaseConfigurado } from './lib/supabase';
import { navesService } from './services/navesService';
import type { Mision, Nave } from './types/hangar';

function App() {
  const [naves, setNaves] = useState<Nave[]>([]);
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    if (!supabaseConfigurado) {
      return;
    }

    let cancelado = false;

    async function cargar() {
      try {
        const lista = await navesService.listar();
        if (!cancelado) {
          setNaves(lista);
          setErrorCarga('');
        }
      } catch {
        if (!cancelado) {
          setErrorCarga('No se pudo cargar la flota.');
        }
      }
    }

    void cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  function handleNaveCreada(nave: Nave) {
    setNaves((prev) => [...prev, nave]);
  }

  function handleMisionCreada(mision: Mision) {
    setMisiones((prev) => [...prev, mision]);
  }

  if (!supabaseConfigurado) {
    return (
      <main>
        <h1>Hangar Orbital</h1>
        <p className="error">
          Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Cópialas en
          .env.local (o .env), guarda y reinicia npm run dev.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Hangar Orbital</h1>
      <p>Centro de Comando Espacial</p>

      <section>
        <h2>Registrar nave</h2>
        <FormularioNave onCreada={handleNaveCreada} />
      </section>

      <section>
        <h2>Flota</h2>
        {errorCarga ? <p className="error">{errorCarga}</p> : null}
        <ListaNaves naves={naves} />
      </section>

      <section>
        <h2>Asignar misión</h2>
        <FormularioMision naves={naves} onCreada={handleMisionCreada} />
        {misiones.length > 0 ? (
          <ul>
            {misiones.map((m) => {
              const nave = naves.find((n) => n.id === m.naveId);
              return (
                <li key={m.id}>
                  {nave?.nombre ?? m.naveId} → {m.destino} (
                  {m.fechaDespegue}, {m.duracionDias} días)
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

export default App;
