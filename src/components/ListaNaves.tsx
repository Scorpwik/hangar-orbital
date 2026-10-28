import type { Nave } from '../types/hangar';

type Props = {
  naves: Nave[];
};

export function ListaNaves({ naves }: Props) {
  if (naves.length === 0) {
    return <p>Aún no hay naves en la flota.</p>;
  }

  return (
    <ul>
      {naves.map((nave) => (
        <li key={nave.id}>
          {nave.nombre} — {nave.clase} — {nave.combustible}%
          {nave.enReparacion ? ' — en reparación' : ''}
        </li>
      ))}
    </ul>
  );
}
