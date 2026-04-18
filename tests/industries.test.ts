import { describe, it, expect } from 'vitest';
const { getIndustries } = require('../index.js');

describe('getIndustries', () => {
  const raw = getIndustries();

  it('returns a string (YAML content)', () => {
    expect(typeof raw).toBe('string');
  });

  it('is not null', () => {
    expect(raw).not.toBeNull();
  });

  it('contains industries keyword', () => {
    expect(raw).toContain('industries:');
  });

  it('has at least 10 industries', () => {
    const matches = raw.match(/- id:/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });

  it('each industry has a name', () => {
    const ids = raw.match(/- id: \w+/g)!;
    const names = raw.match(/name: .+/g)!;
    expect(names.length).toBeGreaterThanOrEqual(ids.length);
  });

  it('includes technology industry', () => {
    expect(raw).toContain('id: technology');
  });

  it('includes finance industry', () => {
    expect(raw).toContain('id: finance');
  });

  it('includes healthcare industry', () => {
    expect(raw).toContain('id: healthcare');
  });
});
