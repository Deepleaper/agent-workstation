import { describe, it, expect } from 'vitest';
import {
  getCategories, getRole, getIndustryBrainSeed, getJobBrainSeed,
  getWorkstationBrainSeed, getBrainSeeds, searchRoles, getPopularRoles, validateRole,
} from '../index.js';

const ALL_CATEGORIES = [
  'admin', 'content', 'customer-service', 'customer-success', 'data',
  'design', 'education', 'engineering', 'executive', 'finance',
  'healthcare', 'hr', 'legal', 'marketing', 'operations',
  'product', 'research', 'sales', 'tech',
];

// Collect all roles once
const allRoles: { category: string; role: string }[] = [];
for (const cat of getCategories()) {
  for (const r of cat.roles) allRoles.push({ category: cat.name, role: r });
}

// Pick 10 diverse roles for spot checks
const SPOT_CHECK_ROLES = [
  { category: 'engineering', role: 'backend-developer' },
  { category: 'data', role: 'data-analyst' },
  { category: 'hr', role: 'recruiter' },
  { category: 'sales', role: 'account-executive' },
  { category: 'finance', role: 'financial-analyst' },
  { category: 'design', role: 'ui-designer' },
  { category: 'legal', role: 'corporate-lawyer' },
  { category: 'marketing', role: 'content-marketer' },
  { category: 'healthcare', role: 'clinical-data-analyst' },
  { category: 'executive', role: 'chief-of-staff' },
];

describe('Comprehensive: all 100 roles have system-prompt.md (50+ lines)', () => {
  it('every role has system-prompt.md with 50+ lines', () => {
    expect(allRoles.length).toBe(100);
    for (const { category, role } of allRoles) {
      const r = getRole(category, role);
      const prompt = r.files['system-prompt.md'] || r.files['prompts/system.md'];
      expect(prompt, `Missing system prompt for ${category}/${role}`).toBeTruthy();
      const lines = prompt.split('\n').length;
      expect(lines, `system-prompt.md for ${category}/${role} has only ${lines} lines`).toBeGreaterThanOrEqual(50);
    }
  });
});

describe('Comprehensive: all 100 roles have brain-seed.md (30+ lines)', () => {
  it('every role has brain-seed.md with 30+ lines', () => {
    for (const { category, role } of allRoles) {
      const seed = getJobBrainSeed(category, role);
      expect(seed, `Missing brain-seed.md for ${category}/${role}`).not.toBeNull();
      const lines = seed!.split('\n').length;
      expect(lines, `brain-seed.md for ${category}/${role} has only ${lines} lines`).toBeGreaterThanOrEqual(30);
    }
  });
});

describe('Comprehensive: all 100 roles have workstation-seed.md (30+ lines)', () => {
  it('every role has workstation-seed.md with 30+ lines', () => {
    for (const { category, role } of allRoles) {
      const seed = getWorkstationBrainSeed(category, role);
      expect(seed, `Missing workstation-seed.md for ${category}/${role}`).not.toBeNull();
      const lines = seed!.split('\n').length;
      expect(lines, `workstation-seed.md for ${category}/${role} has only ${lines} lines`).toBeGreaterThanOrEqual(30);
    }
  });
});

describe('Comprehensive: all 19 categories have brain-seed.md (40+ lines)', () => {
  it('exactly 19 categories', () => {
    expect(getCategories().length).toBe(19);
  });

  it.each(ALL_CATEGORIES)('category %s has brain-seed.md with 40+ lines', (cat) => {
    const seed = getIndustryBrainSeed(cat);
    expect(seed).not.toBeNull();
    const lines = seed!.split('\n').length;
    expect(lines).toBeGreaterThanOrEqual(40);
  });
});

describe('Comprehensive: getJobBrainSeed spot check 10 roles', () => {
  it.each(SPOT_CHECK_ROLES)('$category/$role has job brain seed', ({ category, role }) => {
    const seed = getJobBrainSeed(category, role);
    expect(seed).not.toBeNull();
    expect(seed!.length).toBeGreaterThan(200);
    // Should contain markdown headers
    expect(seed).toMatch(/^#/m);
  });
});

describe('Comprehensive: getWorkstationSeed spot check 10 roles', () => {
  it.each(SPOT_CHECK_ROLES)('$category/$role has workstation seed', ({ category, role }) => {
    const seed = getWorkstationBrainSeed(category, role);
    expect(seed).not.toBeNull();
    expect(seed!.length).toBeGreaterThan(200);
    expect(seed).toMatch(/^#/m);
  });
});

describe('Comprehensive: getBrainSeeds returns all 3 tiers', () => {
  it.each(SPOT_CHECK_ROLES)('$role returns industry + job + workstation', ({ role }) => {
    const seeds = getBrainSeeds(role);
    expect(seeds).not.toBeNull();
    expect(seeds!.industry, `Missing industry tier for ${role}`).toBeTruthy();
    expect(seeds!.job, `Missing job tier for ${role}`).toBeTruthy();
    expect(seeds!.workstation, `Missing workstation tier for ${role}`).toBeTruthy();
    expect(seeds!.contextTemplate).toBeTruthy();
  });
});

describe('Comprehensive: search functionality', () => {
  it('finds roles by keyword', () => {
    const results = searchRoles('developer');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].role).toContain('developer');
  });

  it('finds roles by partial match', () => {
    const results = searchRoles('data');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty for gibberish', () => {
    expect(searchRoles('xyzzynonexistent123')).toHaveLength(0);
  });

  it('returns empty for null/empty', () => {
    expect(searchRoles('')).toHaveLength(0);
    expect(searchRoles(null as any)).toHaveLength(0);
  });

  it('results have required fields', () => {
    const results = searchRoles('engineer');
    for (const r of results) {
      expect(r).toHaveProperty('category');
      expect(r).toHaveProperty('role');
      expect(r).toHaveProperty('score');
    }
  });
});

describe('Comprehensive: popular roles', () => {
  it('returns 20 popular roles', () => {
    const popular = getPopularRoles();
    expect(popular.length).toBe(20);
  });

  it('all popular roles exist', () => {
    const popular = getPopularRoles();
    for (const p of popular) {
      expect(p.exists, `Popular role ${p.category}/${p.role} does not exist`).toBe(true);
    }
  });
});

describe('Comprehensive: role detail', () => {
  it('role detail includes oad.yaml, system-prompt.md, brain-seed.md, workstation-seed.md', () => {
    const role = getRole('engineering', 'backend-developer');
    expect(role).not.toBeNull();
    expect(role.files['oad.yaml']).toBeDefined();
    expect(role.files['system-prompt.md']).toBeDefined();
    expect(role.files['brain-seed.md']).toBeDefined();
    expect(role.files['workstation-seed.md']).toBeDefined();
  });

  it('all popular roles have oad.yaml with some metadata', () => {
    const popular = getPopularRoles();
    for (const p of popular) {
      if (p.exists) {
        const role = getRole(p.category, p.role);
        const oad = role.files['oad.yaml'];
        expect(oad, `Missing oad.yaml for ${p.category}/${p.role}`).toBeDefined();
        // Accept either name:/description: or title:/id: format
        const hasMetadata = oad.includes('name:') || oad.includes('title:') || oad.includes('id:');
        expect(hasMetadata, `oad.yaml for ${p.category}/${p.role} has no metadata`).toBe(true);
      }
    }
  });
});
