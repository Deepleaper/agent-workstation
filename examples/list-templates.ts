/**
 * Agent Workstation Example: List Templates
 *
 * Browse available industries, categories, and role templates.
 *
 * Run: npx tsx examples/list-templates.ts
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ROLES_DIR = join(ROOT, 'roles');
const INDUSTRIES_FILE = join(ROOT, 'industries', 'index.yaml');

function main() {
  console.log('📋 Agent Workstation — List Templates\n');

  // 1. List industries
  if (existsSync(INDUSTRIES_FILE)) {
    try {
      const data = YAML.parse(readFileSync(INDUSTRIES_FILE, 'utf8'));
      const industries = data.industries || [];
      console.log(`🏭 Industries (${industries.length}):\n`);
      for (const ind of industries.slice(0, 10)) {
        const funcs = (ind.functions || []).join(', ');
        console.log(`  ${ind.id.padEnd(20)} ${ind.name}`);
        console.log(`  ${''.padEnd(20)} Functions: ${funcs}`);
      }
      if (industries.length > 10) {
        console.log(`  ... and ${industries.length - 10} more`);
      }
    } catch (e: any) {
      console.log(`  ⚠️  Could not parse industries: ${e.message}`);
    }
  }

  // 2. List role categories
  console.log('\n📂 Role Categories:\n');
  const categories = readdirSync(ROLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  let totalRoles = 0;
  for (const cat of categories) {
    const roles = readdirSync(join(ROLES_DIR, cat.name), { withFileTypes: true })
      .filter(d => d.isDirectory());
    totalRoles += roles.length;
    console.log(`  ${cat.name.padEnd(22)} ${roles.length} roles`);
  }

  console.log(`\n📊 Total: ${categories.length} categories, ${totalRoles} role templates\n`);

  // 3. Show one example role
  const exampleRole = join(ROLES_DIR, 'engineering', 'backend-developer');
  if (existsSync(exampleRole)) {
    const files = readdirSync(exampleRole);
    console.log('📝 Example role: engineering/backend-developer');
    console.log(`   Files: ${files.join(', ')}\n`);

    const readmePath = join(exampleRole, 'README.md');
    if (existsSync(readmePath)) {
      const readme = readFileSync(readmePath, 'utf8');
      console.log(readme.slice(0, 500));
      if (readme.length > 500) console.log('...\n');
    }
  }

  console.log('✅ Use these templates to bootstrap AI agents for any role.');
  console.log('Next: npx tsx examples/create-workspace.ts\n');
}

main();
