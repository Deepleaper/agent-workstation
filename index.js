const { readFileSync, readdirSync, existsSync } = require('node:fs');
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

function getRole(category, role) {
  const rolePath = join(ROLES_DIR, category, role);
  if (!existsSync(rolePath)) return null;
  const files = {};
  for (const f of readdirSync(rolePath)) {
    files[f] = readFileSync(join(rolePath, f), 'utf8');
  }
  return { category, role, files };
}

module.exports = { getCategories, getRole, ROLES_DIR };
