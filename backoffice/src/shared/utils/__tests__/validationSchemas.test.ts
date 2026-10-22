import { describe, it, expect } from 'vitest';
import { emailValidator, nameValidator, nitValidator } from '../validationSchemas';

describe('emailValidator', () => {
  it('accepts valid email', () => {
    expect(emailValidator.safeParse('user@example.com').success).toBe(true);
  });

  it('rejects plain text (non-email)', () => {
    expect(emailValidator.safeParse('not-an-email').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(emailValidator.safeParse('').success).toBe(false);
  });

  it('normalizes to lowercase', () => {
    const result = emailValidator.safeParse('User@EXAMPLE.COM');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('user@example.com');
  });
});

describe('nameValidator', () => {
  it('accepts letters-only name', () => {
    expect(nameValidator.safeParse('Ana Pérez').success).toBe(true);
  });

  it('rejects digits-only input', () => {
    expect(nameValidator.safeParse('12345').success).toBe(false);
  });

  it('rejects name with @', () => {
    expect(nameValidator.safeParse('user@name').success).toBe(false);
  });

  it('rejects single character', () => {
    expect(nameValidator.safeParse('A').success).toBe(false);
  });
});

describe('nitValidator', () => {
  it('accepts standard NIT format', () => {
    expect(nitValidator.safeParse('12345678-9').success).toBe(true);
  });

  it('accepts CF', () => {
    expect(nitValidator.safeParse('CF').success).toBe(true);
  });

  it('accepts lowercase cf and transforms to CF', () => {
    const result = nitValidator.safeParse('cf');
    expect(result.success).toBe(true);
  });

  it('accepts empty string', () => {
    expect(nitValidator.safeParse('').success).toBe(true);
  });

  it('rejects plain number without check digit', () => {
    expect(nitValidator.safeParse('12345678').success).toBe(false);
  });

  it('rejects free text', () => {
    expect(nitValidator.safeParse('nit invalido').success).toBe(false);
  });
});
