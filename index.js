const { readFileSync, readdirSync, existsSync, statSync } = require('node:fs');
const { join } = require('node:path');

const ROLES_DIR = join(__dirname, 'roles');

function getCategories() {
  return readdirSync(ROLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const roles = readdirSync(join(ROLES_DIR, d.name), { withFileTypes: true })
        .filter(f => f.isDirectory()).map(f => f.name);
      return { name: d.name, roles };
    });
}

function readDirRecursive(dirPath, prefix = '') {
  const files = {};
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      Object.assign(files, readDirRecursive(fullPath, key));
    } else {
      files[key] = readFileSync(fullPath, 'utf8');
    }
  }
  return files;
}

function getRole(category, role) {
  const rolePath = join(ROLES_DIR, category, role);
  if (!existsSync(rolePath)) return null;
  const files = readDirRecursive(rolePath);
  return { category, role, files };
}

function getIndustries() {
  const indexPath = join(__dirname, 'industries', 'index.yaml');
  if (existsSync(indexPath)) return readFileSync(indexPath, 'utf8');
  return null;
}

/**
 * Fuzzy search across all roles by name and description.
 * Returns matching roles sorted by relevance.
 */
function searchRoles(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase();
  const results = [];

  for (const cat of getCategories()) {
    for (const roleName of cat.roles) {
      const rolePath = join(ROLES_DIR, cat.name, roleName);
      // Read oad.yaml for metadata
      const oadPath = join(rolePath, 'oad.yaml');
      let title = roleName.replace(/-/g, ' ');
      let description = '';
      if (existsSync(oadPath)) {
        const oad = readFileSync(oadPath, 'utf8');
        const titleMatch = oad.match(/en:\s*"?([^"\n]+)"?/);
        if (titleMatch) title = titleMatch[1];
        const descMatch = oad.match(/description:\s*\n\s*en:\s*"?([^"\n]+)"?/);
        if (descMatch) description = descMatch[1];
      }
      const haystack = `${roleName} ${title} ${description}`.toLowerCase();
      // Simple fuzzy: all query words must appear somewhere
      const words = q.split(/\s+/).filter(Boolean);
      const allMatch = words.every(w => haystack.includes(w));
      if (allMatch) {
        // Score: exact name match > title match > description match
        let score = 0;
        if (roleName.toLowerCase().includes(q)) score += 100;
        if (title.toLowerCase().includes(q)) score += 50;
        words.forEach(w => { if (haystack.includes(w)) score += 10; });
        results.push({ category: cat.name, role: roleName, title, description, score });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Validate a role template has required fields and adequate prompt depth.
 * Returns { valid: boolean, errors: string[], warnings: string[] }
 */
function validateRole(category, role) {
  const errors = [];
  const warnings = [];

  const rolePath = join(ROLES_DIR, category, role);
  if (!existsSync(rolePath)) {
    return { valid: false, errors: [`Role not found: ${category}/${role}`], warnings };
  }

  // Check oad.yaml
  const oadPath = join(rolePath, 'oad.yaml');
  if (!existsSync(oadPath)) {
    errors.push('Missing oad.yaml (role metadata)');
  } else {
    const oad = readFileSync(oadPath, 'utf8');
    if (!oad.includes('name:')) errors.push('oad.yaml missing "name" field');
    if (!oad.includes('description:')) errors.push('oad.yaml missing "description" field');
  }

  // Check system prompt
  const sysPromptPath = join(rolePath, 'system-prompt.md');
  const legacyPromptPath = join(rolePath, 'prompts', 'system.md');
  let promptLines = 0;
  if (existsSync(sysPromptPath)) {
    promptLines = readFileSync(sysPromptPath, 'utf8').split('\n').length;
  } else if (existsSync(legacyPromptPath)) {
    promptLines = readFileSync(legacyPromptPath, 'utf8').split('\n').length;
  } else {
    errors.push('Missing system prompt (system-prompt.md or prompts/system.md)');
  }

  if (promptLines > 0 && promptLines < 10) {
    warnings.push(`Thin system prompt: only ${promptLines} lines (recommend 50+)`);
  }

  // Check brain-seed
  if (!existsSync(join(rolePath, 'brain-seed.md'))) {
    warnings.push('Missing brain-seed.md (role knowledge base)');
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Returns the top 20 most commonly needed roles (curated).
 */
function getPopularRoles() {
  const popular = [
    { category: 'customer-service', role: 'customer-service-rep' },
    { category: 'engineering', role: 'backend-developer' },
    { category: 'engineering', role: 'frontend-developer' },
    { category: 'data', role: 'data-analyst' },
    { category: 'content', role: 'copywriter' },
    { category: 'product', role: 'product-manager' },
    { category: 'hr', role: 'recruiter' },
    { category: 'sales', role: 'sales-development-rep' },
    { category: 'sales', role: 'account-executive' },
    { category: 'finance', role: 'financial-analyst' },
    { category: 'marketing', role: 'content-marketer' },
    { category: 'legal', role: 'corporate-lawyer' },
    { category: 'engineering', role: 'devops-engineer' },
    { category: 'design', role: 'ui-designer' },
    { category: 'product', role: 'product-owner' },
    { category: 'engineering', role: 'ml-engineer' },
    { category: 'customer-success', role: 'customer-success-manager' },
    { category: 'executive', role: 'chief-of-staff' },
    { category: 'operations', role: 'operations-analyst' },
    { category: 'research', role: 'trend-analyst' },
  ];

  return popular.map(p => {
    const role = getRole(p.category, p.role);
    return { ...p, exists: role !== null };
  });
}

module.exports = { getCategories, getRole, getIndustries, searchRoles, validateRole, getPopularRoles, ROLES_DIR };
