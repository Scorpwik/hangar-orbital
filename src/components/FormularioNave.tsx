import { useState, type FormEvent } from 'react';
import { navesService } from '../services/navesService';
import type { ClaseNave, Nave } from '../types/hangar';

type Props = {
  onCreada: (nave: Nave) => void;
};

const CLASES: ClaseNave[] = ['exploradora', 'carguera', 'transporte'];

export function FormularioNave({ onCreada }: Props) {
  const [nombre, setNombre] = useState('');
  const [clase, setClase] = useState<ClaseNave | ''>('');
  const [combustible, setCombustible] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setEnviando(true);

    try {
      if (!nombre.trim() || !clase || combustible === '') {
        throw new Error('Completa nombre, clase y combustible.');
      }

      const valorCombustible = Number(combustible);
      const nave = await navesService.crear({
        nombre,
        clase,
        combustible: valorCombustible,
      });

      setNombre('');
      setClase('');
      setCombustible('');
      onCreada(nave);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'No se pudo registrar la nave. Inténtalo de nuevo.';
      const conocidos = [
        'Completa nombre, clase y combustible.',
        'Ya hay una nave con ese nombre.',
        'La clase debe ser exploradora, carguera o transporte.',
        'El combustible debe ser un entero entre 0 y 100.',
      ];
      setError(
        conocidos.includes(mensaje)
          ? mensaje
          : 'No se pudo registrar la nave. Inténtalo de nuevo.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label>
        Clase
        <select
          value={clase}
          onChange={(e) => setClase(e.target.value as ClaseNave | '')}
        >
          <option value="">Selecciona una clase</option>
          {CLASES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Combustible (%)
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={combustible}
          onChange={(e) => setCombustible(e.target.value)}
        />
      </label>
      <button type="submit" disabled={enviando}>
        Registrar nave
      </button>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
