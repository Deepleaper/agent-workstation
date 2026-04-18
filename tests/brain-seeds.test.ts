import { describe, it, expect } from 'vitest';
import { getIndustryBrainSeed, getJobBrainSeed, getWorkstationBrainSeed, getContextTemplate, getBrainSeeds, getCategories } from '../index.js';

const ALL_CATEGORIES = [
  'admin', 'content', 'customer-service', 'customer-success', 'data',
  'design', 'education', 'engineering', 'executive', 'finance',
  'healthcare', 'hr', 'legal', 'marketing', 'operations',
  'product', 'research', 'sales', 'tech',
];

describe('3-tier brain seeds', () => {
  describe('getIndustryBrainSeed', () => {
    it('returns content for all 19 categories', () => {
      for (const cat of ALL_CATEGORIES) {
        const seed = getIndustryBrainSeed(cat);
        expect(seed, `Industry seed missing for ${cat}`).not.toBeNull();
        expect(seed.length).toBeGreaterThan(100);
      }
    });

    it('all industry brain seeds have 40+ lines', () => {
      for (const cat of ALL_CATEGORIES) {
        const seed = getIndustryBrainSeed(cat);
        const lines = seed.split('\n').length;
        expect(lines, `Industry seed for ${cat} has only ${lines} lines`).toBeGreaterThanOrEqual(40);
      }
    });

    it('returns null for non-existent category', () => {
      expect(getIndustryBrainSeed('nonexistent')).toBeNull();
    });
  });

  describe('getWorkstationBrainSeed', () => {
    it('returns content for all 100 roles', () => {
      const categories = getCategories();
      let count = 0;
      for (const cat of categories) {
        for (const role of cat.roles) {
          const seed = getWorkstationBrainSeed(cat.name, role);
          expect(seed, `Workstation seed missing for ${cat.name}/${role}`).not.toBeNull();
          expect(seed.length).toBeGreaterThan(100);
          count++;
        }
      }
      expect(count).toBe(100);
    });

    it('all workstation seeds have 30+ lines', () => {
      const categories = getCategories();
      for (const cat of categories) {
        for (const role of cat.roles) {
          const seed = getWorkstationBrainSeed(cat.name, role);
          if (seed) {
            const lines = seed.split('\n').length;
            expect(lines, `Workstation seed for ${cat.name}/${role} has only ${lines} lines`).toBeGreaterThanOrEqual(30);
          }
        }
      }
    });
  });

  describe('getContextTemplate', () => {
    it('returns template content', () => {
      const template = getContextTemplate();
      expect(template).toBeTruthy();
      expect(template).toContain('公司名称');
      expect(template).toContain('产品/服务知识');
    });
  });

  describe('getBrainSeeds', () => {
    it('returns all 3 tiers for a known role', () => {
      const seeds = getBrainSeeds('frontend-developer');
      expect(seeds).not.toBeNull();
      expect(seeds.industry).toBeTruthy();
      expect(seeds.workstation).toBeTruthy();
      expect(seeds.contextTemplate).toBeTruthy();
    });

    it('returns null for non-existent role', () => {
      expect(getBrainSeeds('nonexistent-role')).toBeNull();
    });

    it('contextTemplate is same across all roles', () => {
      const template = getContextTemplate();
      const seeds1 = getBrainSeeds('recruiter');
      const seeds2 = getBrainSeeds('data-analyst');
      expect(seeds1.contextTemplate).toBe(template);
      expect(seeds2.contextTemplate).toBe(template);
    });
  });
});
