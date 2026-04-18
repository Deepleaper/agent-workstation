import { describe, it, expect } from 'vitest';
const { getPopularRoles, getCategories } = require('../index.js');

describe('getPopularRoles', () => {
  const popular = getPopularRoles();

  it('returns exactly 20 roles', () => {
    expect(popular).toHaveLength(20);
  });

  it('each entry has category and role', () => {
    for (const p of popular) {
      expect(p.category).toBeDefined();
      expect(p.role).toBeDefined();
    }
  });

  it('each entry has exists boolean', () => {
    for (const p of popular) {
      expect(typeof p.exists).toBe('boolean');
    }
  });

  it('popular roles span diverse categories', () => {
    const cats = new Set(popular.map((p: any) => p.category));
    expect(cats.size).toBeGreaterThanOrEqual(5);
  });

  it('most popular roles actually exist', () => {
    const existing = popular.filter((p: any) => p.exists);
    expect(existing.length).toBeGreaterThanOrEqual(10);
  });

  it('no duplicate entries', () => {
    const keys = popular.map((p: any) => `${p.category}/${p.role}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
