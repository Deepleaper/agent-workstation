import { describe, it, expect } from 'vitest';
const { getCategories } = require('../index.js');

describe('getCategories', () => {
  const categories = getCategories();

  it('returns an array', () => {
    expect(Array.isArray(categories)).toBe(true);
  });

  it('has 10+ categories', () => {
    expect(categories.length).toBeGreaterThanOrEqual(10);
  });

  it('each category has a name', () => {
    for (const cat of categories) {
      expect(cat.name).toBeDefined();
      expect(typeof cat.name).toBe('string');
      expect(cat.name.length).toBeGreaterThan(0);
    }
  });

  it('each category has roles array', () => {
    for (const cat of categories) {
      expect(Array.isArray(cat.roles)).toBe(true);
    }
  });

  it('at least some categories have roles', () => {
    const withRoles = categories.filter((c: any) => c.roles.length > 0);
    expect(withRoles.length).toBeGreaterThanOrEqual(5);
  });

  it('category names are unique', () => {
    const names = categories.map((c: any) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('no duplicate role names within a category', () => {
    for (const cat of categories) {
      const roleNames = cat.roles;
      expect(new Set(roleNames).size).toBe(roleNames.length);
    }
  });

  it('includes customer-service category', () => {
    expect(categories.find((c: any) => c.name === 'customer-service')).toBeDefined();
  });

  it('includes engineering category', () => {
    expect(categories.find((c: any) => c.name === 'engineering')).toBeDefined();
  });

  it('includes sales category', () => {
    expect(categories.find((c: any) => c.name === 'sales')).toBeDefined();
  });

  it('includes finance category', () => {
    expect(categories.find((c: any) => c.name === 'finance')).toBeDefined();
  });

  it('includes hr category', () => {
    expect(categories.find((c: any) => c.name === 'hr')).toBeDefined();
  });

  it('includes data category', () => {
    expect(categories.find((c: any) => c.name === 'data')).toBeDefined();
  });

  it('total roles across all categories is 10+', () => {
    const total = categories.reduce((sum: number, c: any) => sum + c.roles.length, 0);
    expect(total).toBeGreaterThanOrEqual(10);
  });

  it('category names are kebab-case', () => {
    for (const cat of categories) {
      expect(cat.name).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});
