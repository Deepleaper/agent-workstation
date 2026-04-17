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

module.exports = { getCategories, getRole, ROLES_DIR };
