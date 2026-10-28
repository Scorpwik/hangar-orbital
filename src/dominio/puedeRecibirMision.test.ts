import { describe, expect, it } from 'vitest';
import { puedeRecibirMision } from './puedeRecibirMision';

describe('puedeRecibirMision', () => {
  it('permite nave apta con menos de 3 misiones', () => {
    expect(
      puedeRecibirMision({ combustible: 80, enReparacion: false }, 2),
    ).toEqual({ puede: true });
  });

  it('permite exactamente 25 % de combustible', () => {
    expect(
      puedeRecibirMision({ combustible: 25, enReparacion: false }, 0),
    ).toEqual({ puede: true });
  });

  it('rechaza nave en reparación', () => {
    expect(
      puedeRecibirMision({ combustible: 80, enReparacion: true }, 0),
    ).toEqual({
      puede: false,
      motivo: 'Esa nave está en dique seco y no puede recibir misiones.',
    });
  });

  it('rechaza cuando ya tiene 3 misiones desde la revisión', () => {
    expect(
      puedeRecibirMision({ combustible: 80, enReparacion: false }, 3),
    ).toEqual({
      puede: false,
      motivo: 'Esa nave ya tiene 3 misiones desde su última revisión.',
    });
  });

  it('rechaza combustible menor a 25 %', () => {
    expect(
      puedeRecibirMision({ combustible: 24, enReparacion: false }, 0),
    ).toEqual({
      puede: false,
      motivo: 'Esa nave no tiene combustible suficiente (mínimo 25 %).',
    });
  });
});
