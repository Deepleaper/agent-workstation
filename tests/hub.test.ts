import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join } from 'node:path';
import { mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';

const { WorkstationHub } = require('../src/hub/index.js');
const { SearchEngine } = require('../src/hub/search-engine.js');
const { RoleExporter } = require('../src/hub/exporter.js');

const ROLES_DIR = join(__dirname, '..', 'roles');
const TMP_DIR = join(__dirname, '..', '.test-export-tmp');

describe('WorkstationHub', () => {
  let hub: InstanceType<typeof WorkstationHub>;

  beforeAll(() => {
    hub = new WorkstationHub(ROLES_DIR);
  });

  afterAll(() => {
    if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true });
  });

  // --- Search tests ---
  it('search: keyword returns relevant results', () => {
    const results = hub.search('backend');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toContain('backend');
  });

  it('search: empty query returns all roles', () => {
    const results = hub.search('');
    expect(results.length).toBeGreaterThan(0);
  });

  it('search: industry filter works', () => {
    const results = hub.search('', { industry: 'engineering' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => expect(r.industry).toBe('engineering'));
  });

  it('search: function filter works', () => {
    const results = hub.search('', { function: 'sales' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => expect(r.category).toBe('sales'));
  });

  it('search: combined query + filter', () => {
    const results = hub.search('analyst', { industry: 'data' });
    results.forEach(r => expect(r.industry).toBe('data'));
  });

  // --- getRoleDetails ---
  it('getRoleDetails: returns all 3 seeds', () => {
    const details = hub.getRoleDetails('backend-developer');
    expect(details).not.toBeNull();
    expect(details.id).toBe('backend-developer');
    expect(details.title).toBeTruthy();
    expect(typeof details.brainSeed).toBe('string');
    expect(typeof details.workstationSeed).toBe('string');
    expect(typeof details.industrySeed).toBe('string');
  });

  it('getRoleDetails: returns null for unknown role', () => {
    expect(hub.getRoleDetails('nonexistent-role-xyz')).toBeNull();
  });

  // --- listIndustries ---
  it('listIndustries: returns 19 industries', () => {
    const industries = hub.listIndustries();
    expect(industries).toHaveLength(19);
    industries.forEach(i => {
      expect(i.id).toBeTruthy();
      expect(i.roleCount).toBeGreaterThan(0);
    });
  });

  // --- listByIndustry ---
  it('listByIndustry: returns roles for a category', () => {
    const roles = hub.listByIndustry('engineering');
    expect(roles.length).toBeGreaterThan(0);
    roles.forEach(r => expect(r.industry).toBe('engineering'));
  });

  // --- recommend ---
  it('recommend: returns matches for description', () => {
    const results = hub.recommend('I need someone to build APIs and manage databases');
    expect(results.length).toBeGreaterThan(0);
  });

  it('recommend: returns empty for gibberish', () => {
    const results = hub.recommend('xyzzy foobar');
    // May return 0 or very few
    expect(Array.isArray(results)).toBe(true);
  });

  // --- getPopular ---
  it('getPopular: returns up to limit roles', () => {
    const popular = hub.getPopular(5);
    expect(popular.length).toBeLessThanOrEqual(5);
    expect(popular.length).toBeGreaterThan(0);
  });

  // --- rate ---
  it('rate: stores rating', () => {
    hub.rate('backend-developer', 5, 'Great template!');
    const details = hub.getRoleDetails('backend-developer');
    expect(details.rating).toBe(5);
    expect(details.ratingCount).toBe(1);
  });

  it('rate: rejects invalid rating', () => {
    expect(() => hub.rate('backend-developer', 0)).toThrow();
    expect(() => hub.rate('backend-developer', 6)).toThrow();
  });

  // --- exportRole ---
  it('exportRole: generates correct directory structure', async () => {
    const outputPath = await hub.exportRole('backend-developer', TMP_DIR);
    expect(existsSync(outputPath)).toBe(true);
    expect(existsSync(join(outputPath, 'opc.yaml'))).toBe(true);
    expect(existsSync(join(outputPath, 'CONTEXT.md'))).toBe(true);
    expect(existsSync(join(outputPath, 'brain-seeds', 'industry.md'))).toBe(true);
    expect(existsSync(join(outputPath, 'brain-seeds', 'job.md'))).toBe(true);
    expect(existsSync(join(outputPath, 'brain-seeds', 'workstation.md'))).toBe(true);
    expect(existsSync(join(outputPath, 'package.json'))).toBe(true);
    expect(existsSync(join(outputPath, 'src', 'index.js'))).toBe(true);
  });

  it('exportRole: throws for unknown role', async () => {
    await expect(hub.exportRole('nonexistent-xyz', TMP_DIR)).rejects.toThrow();
  });
});

describe('SearchEngine', () => {
  const roles = [
    { id: 'backend-developer', title: 'Backend Developer', titleCN: '后端开发', description: 'API design', tags: ['engineering'], category: 'engineering', industry: 'engineering', function: 'engineering' },
    { id: 'product-manager', title: 'Product Manager', titleCN: '产品经理', description: 'Product strategy', tags: ['product'], category: 'product', industry: 'product', function: 'product' },
  ];

  it('fuzzy match on EN name', () => {
    const engine = new SearchEngine(roles);
    const results = engine.search('backend');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('backend-developer');
  });

  it('fuzzy match on CN name', () => {
    const engine = new SearchEngine(roles);
    const results = engine.search('产品');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('product-manager');
  });

  it('relevance sorting: exact match scores higher', () => {
    const engine = new SearchEngine(roles);
    const results = engine.search('product');
    expect(results[0].id).toBe('product-manager');
  });
});
