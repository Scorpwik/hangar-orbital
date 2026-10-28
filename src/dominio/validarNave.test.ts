import { describe, expect, it } from 'vitest';
import type { DatosNave } from '../types/hangar';
import { validarNave } from './validarNave';

const base: DatosNave = {
  nombre: 'Aurora',
  clase: 'exploradora',
  combustible: 80,
};

describe('validarNave', () => {
  it('acepta una nave válida', () => {
    expect(validarNave(base, [])).toEqual({ ok: true });
  });

  it('acepta las tres clases permitidas', () => {
    expect(validarNave({ ...base, clase: 'exploradora' }, []).ok).toBe(true);
    expect(validarNave({ ...base, clase: 'carguera' }, []).ok).toBe(true);
    expect(validarNave({ ...base, clase: 'transporte' }, []).ok).toBe(true);
  });

  it('rechaza datos incompletos', () => {
    expect(validarNave({ ...base, nombre: '   ' }, []).ok).toBe(false);
    expect(
      validarNave({ ...base, clase: '' as DatosNave['clase'] }, []).ok,
    ).toBe(false);
    expect(
      validarNave(
        { ...base, combustible: undefined as unknown as number },
        [],
      ).ok,
    ).toBe(false);
  });

  it('rechaza nombre repetido', () => {
    const resultado = validarNave(base, ['Aurora']);
    expect(resultado).toEqual({
      ok: false,
      motivo: 'Ya hay una nave con ese nombre.',
    });
  });

  it('rechaza clase inválida', () => {
    const resultado = validarNave(
      { ...base, clase: 'cazadora' as DatosNave['clase'] },
      [],
    );
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.motivo).toMatch(/exploradora/);
    }
  });

  it('rechaza combustible fuera de rango o no entero', () => {
    expect(validarNave({ ...base, combustible: 120 }, []).ok).toBe(false);
    expect(validarNave({ ...base, combustible: -1 }, []).ok).toBe(false);
    expect(validarNave({ ...base, combustible: 50.5 }, []).ok).toBe(false);
  });
});
