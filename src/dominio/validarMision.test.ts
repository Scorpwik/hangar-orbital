import { describe, expect, it } from 'vitest';
import type { DatosMision } from '../types/hangar';
import { validarMision } from './validarMision';

const hoy = '2026-10-28';

const base: DatosMision = {
  naveId: 'nave-1',
  destino: 'Órbita baja',
  fechaDespegue: '2026-10-28',
  duracionDias: 3,
};

describe('validarMision', () => {
  it('acepta una misión válida con fecha de hoy', () => {
    expect(validarMision(base, hoy)).toEqual({ ok: true });
  });

  it('acepta fecha de despegue futura', () => {
    expect(
      validarMision({ ...base, fechaDespegue: '2026-11-01' }, hoy).ok,
    ).toBe(true);
  });

  it('rechaza datos incompletos', () => {
    expect(validarMision({ ...base, naveId: '' }, hoy).ok).toBe(false);
    expect(validarMision({ ...base, destino: '  ' }, hoy).ok).toBe(false);
    expect(validarMision({ ...base, fechaDespegue: '' }, hoy).ok).toBe(false);
    expect(
      validarMision(
        { ...base, duracionDias: undefined as unknown as number },
        hoy,
      ).ok,
    ).toBe(false);
  });

  it('rechaza fecha anterior a hoy', () => {
    const resultado = validarMision(
      { ...base, fechaDespegue: '2026-10-27' },
      hoy,
    );
    expect(resultado).toEqual({
      ok: false,
      motivo: 'La fecha de despegue no puede ser anterior a hoy.',
    });
  });

  it('rechaza duración inválida', () => {
    expect(validarMision({ ...base, duracionDias: 0 }, hoy).ok).toBe(false);
    expect(validarMision({ ...base, duracionDias: -2 }, hoy).ok).toBe(false);
    expect(validarMision({ ...base, duracionDias: 1.5 }, hoy).ok).toBe(false);
  });
});
