import { describe, it, expect } from 'vitest';
const { searchRoles } = require('../index.js');

describe('searchRoles', () => {
  it('finds results for "developer"', () => {
    const results = searchRoles('developer');
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds results for "customer service"', () => {
    const results = searchRoles('customer service');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty for nonexistent query', () => {
    const results = searchRoles('xyz-absolutely-nonexistent-role-999');
    expect(results).toEqual([]);
  });

  it('is case-insensitive', () => {
    const lower = searchRoles('developer');
    const upper = searchRoles('DEVELOPER');
    expect(lower.length).toBe(upper.length);
  });

  it('returns empty for empty string', () => {
    expect(searchRoles('')).toEqual([]);
  });

  it('returns empty for null', () => {
    expect(searchRoles(null)).toEqual([]);
  });

  it('results have category and role fields', () => {
    const results = searchRoles('analyst');
    for (const r of results) {
      expect(r.category).toBeDefined();
      expect(r.role).toBeDefined();
    }
  });

  it('results are sorted by score descending', () => {
    const results = searchRoles('analyst');
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('multi-word search works', () => {
    const results = searchRoles('sales rep');
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds roles by partial name match', () => {
    const results = searchRoles('recruit');
    expect(results.length).toBeGreaterThan(0);
  });

  it('results include title field', () => {
    const results = searchRoles('analyst');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
  });
});
