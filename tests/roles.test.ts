import { describe, it, expect } from 'vitest';
const { getRole, getCategories } = require('../index.js');

describe('getRole', () => {
  it('returns a role object for valid category/role', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role).not.toBeNull();
    expect(role.category).toBe('customer-service');
    expect(role.role).toBe('customer-service-rep');
  });

  it('returns null for invalid category', () => {
    expect(getRole('nonexistent-category', 'some-role')).toBeNull();
  });

  it('returns null for invalid role', () => {
    expect(getRole('customer-service', 'nonexistent-role')).toBeNull();
  });

  it('role has files object', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files).toBeDefined();
    expect(typeof role.files).toBe('object');
  });

  it('role has oad.yaml in files', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files['oad.yaml']).toBeDefined();
  });

  it('role has system-prompt.md or prompts/system.md', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    const hasPrompt = role.files['system-prompt.md'] || role.files['prompts/system.md'];
    expect(hasPrompt).toBeDefined();
  });

  it('system prompt has substantial content (50+ lines for full roles)', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    const prompt = role.files['system-prompt.md'] || role.files['prompts/system.md'];
    const lines = prompt.split('\n').length;
    expect(lines).toBeGreaterThanOrEqual(50);
  });

  it('role has brain-seed.md', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files['brain-seed.md']).toBeDefined();
  });

  it('at least 10 roles have brain-seed.md', () => {
    const categories = getCategories();
    let count = 0;
    for (const cat of categories) {
      for (const roleName of cat.roles) {
        const role = getRole(cat.name, roleName);
        if (role && role.files['brain-seed.md']) count++;
      }
    }
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it('role oad.yaml contains description', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files['oad.yaml']).toContain('description');
  });

  it('role oad.yaml contains name field', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files['oad.yaml']).toContain('name:');
  });

  it('returns null for path-traversal attempt', () => {
    expect(getRole('../../etc', 'passwd')).toBeNull();
  });

  it('different roles return different files', () => {
    const role1 = getRole('customer-service', 'customer-service-rep');
    const role2 = getRole('sales', 'sales-development-rep');
    if (role1 && role2) {
      expect(role1.files['system-prompt.md']).not.toBe(role2.files['system-prompt.md']);
    }
  });

  it('role has README.md', () => {
    const role = getRole('customer-service', 'customer-service-rep');
    expect(role.files['README.md']).toBeDefined();
  });

  it('all roles in categories are loadable', () => {
    const categories = getCategories();
    for (const cat of categories) {
      for (const roleName of cat.roles) {
        const role = getRole(cat.name, roleName);
        expect(role).not.toBeNull();
      }
    }
  });
});
