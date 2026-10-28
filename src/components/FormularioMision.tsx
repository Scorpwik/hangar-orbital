import { useState, type FormEvent } from 'react';
import { misionesService } from '../services/misionesService';
import type { Mision, Nave } from '../types/hangar';

type Props = {
  naves: Nave[];
  onCreada: (mision: Mision) => void;
};

function fechaHoyLocal(): string {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const MENSAJES_CONOCIDOS = [
  'Completa nave, destino, fecha de despegue y duración.',
  'La fecha de despegue no puede ser anterior a hoy.',
  'La duración debe ser un número entero de al menos 1 día.',
  'Esa nave está en dique seco y no puede recibir misiones.',
  'Esa nave ya tiene 3 misiones desde su última revisión.',
  'Esa nave no tiene combustible suficiente (mínimo 25 %).',
];

export function FormularioMision({ naves, onCreada }: Props) {
  const [naveId, setNaveId] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaDespegue, setFechaDespegue] = useState(fechaHoyLocal());
  const [duracionDias, setDuracionDias] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setOk('');
    setEnviando(true);

    try {
      if (!naveId || !destino.trim() || !fechaDespegue || duracionDias === '') {
        throw new Error(
          'Completa nave, destino, fecha de despegue y duración.',
        );
      }

      const nave = naves.find((n) => n.id === naveId);
      if (!nave) {
        throw new Error(
          'Completa nave, destino, fecha de despegue y duración.',
        );
      }

      const mision = await misionesService.crear(
        {
          naveId,
          destino,
          fechaDespegue,
          duracionDias: Number(duracionDias),
        },
        nave,
        fechaHoyLocal(),
      );

      setDestino('');
      setDuracionDias('');
      setOk('Misión asignada correctamente.');
      onCreada(mision);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'No se pudo asignar la misión. Inténtalo de nuevo.';
      setError(
        MENSAJES_CONOCIDOS.includes(mensaje)
          ? mensaje
          : 'No se pudo asignar la misión. Inténtalo de nuevo.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nave
        <select value={naveId} onChange={(e) => setNaveId(e.target.value)}>
          <option value="">Selecciona una nave</option>
          {naves.map((nave) => (
            <option key={nave.id} value={nave.id}>
              {nave.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Destino
        <input
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label>
        Fecha de despegue
        <input
          type="date"
          value={fechaDespegue}
          onChange={(e) => setFechaDespegue(e.target.value)}
        />
      </label>
      <label>
        Duración (días)
        <input
          type="number"
          min={1}
          step={1}
          value={duracionDias}
          onChange={(e) => setDuracionDias(e.target.value)}
        />
      </label>
      <button type="submit" disabled={enviando || naves.length === 0}>
        Asignar misión
      </button>
      {error ? <p className="error">{error}</p> : null}
      {ok ? <p className="ok">{ok}</p> : null}
    </form>
  );
}
