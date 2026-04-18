import { describe, it, expect } from 'vitest';
const { validateRole, getCategories } = require('../index.js');

describe('validateRole', () => {
  it('valid role passes validation', () => {
    const result = validateRole('customer-service', 'customer-service-rep');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('nonexistent role fails', () => {
    const result = validateRole('fake-cat', 'fake-role');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('result has errors array', () => {
    const result = validateRole('customer-service', 'customer-service-rep');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('result has warnings array', () => {
    const result = validateRole('customer-service', 'customer-service-rep');
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('full roles have no errors', () => {
    const fullRoles = [
      ['customer-service', 'customer-service-rep'],
      ['sales', 'sales-development-rep'],
      ['finance', 'accounts-payable-clerk'],
    ];
    for (const [cat, role] of fullRoles) {
      const result = validateRole(cat, role);
      expect(result.valid).toBe(true);
    }
  });

  it('returns valid=false for nonexistent category', () => {
    const result = validateRole('zzz-nonexistent', 'some-role');
    expect(result.valid).toBe(false);
  });

  it('error message mentions role not found for missing role', () => {
    const result = validateRole('zzz', 'zzz');
    expect(result.errors[0]).toContain('not found');
  });

  it('validates all roles without crashing', () => {
    const categories = getCategories();
    for (const cat of categories) {
      for (const roleName of cat.roles) {
        const result = validateRole(cat.name, roleName);
        expect(result).toHaveProperty('valid');
        expect(result).toHaveProperty('errors');
        expect(result).toHaveProperty('warnings');
      }
    }
  });

  it('rich prompt roles have no thin-prompt warning', () => {
    const result = validateRole('customer-service', 'customer-service-rep');
    const thinWarning = result.warnings.find((w: string) => w.includes('Thin'));
    expect(thinWarning).toBeUndefined();
  });

  it('result has boolean valid field', () => {
    const result = validateRole('customer-service', 'customer-service-rep');
    expect(typeof result.valid).toBe('boolean');
  });
});
