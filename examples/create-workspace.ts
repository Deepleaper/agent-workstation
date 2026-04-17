/**
 * Agent Workstation Example: Create Workspace
 *
 * Load a role template and show its components (OAD, system prompt, brain seed).
 *
 * Run: npx tsx examples/create-workspace.ts [category/role]
 * Example: npx tsx examples/create-workspace.ts sales/account-executive
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ROLES_DIR = join(ROOT, 'roles');

function main() {
  console.log('🏗️  Agent Workstation — Create Workspace\n');

  // Default role or from CLI arg
  const rolePath = process.argv[2] || 'sales/account-executive';
  const fullPath = join(ROLES_DIR, rolePath);

  if (!existsSync(fullPath)) {
    console.log(`❌ Role "${rolePath}" not found!\n`);
    console.log('Available roles:');
    const cats = readdirSync(ROLES_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const cat of cats.slice(0, 5)) {
      const roles = readdirSync(join(ROLES_DIR, cat.name), { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);
      console.log(`  ${cat.name}/: ${roles.slice(0, 3).join(', ')}${roles.length > 3 ? '...' : ''}`);
    }
    console.log('\nUsage: npx tsx examples/create-workspace.ts engineering/backend-developer');
    process.exit(1);
  }

  console.log(`📂 Loading template: ${rolePath}\n`);

  // List all files in the role
  const files = readdirSync(fullPath);
  console.log(`Files: ${files.join(', ')}\n`);

  // Show OAD config if present
  const oadPath = join(fullPath, 'oad.yaml');
  if (existsSync(oadPath)) {
    const oad = readFileSync(oadPath, 'utf8');
    console.log('📋 OAD Config (Agent Definition):');
    console.log('─'.repeat(40));
    // Show first 30 lines
    const lines = oad.split('\n').slice(0, 30);
    for (const line of lines) {
      console.log(`  ${line}`);
    }
    if (oad.split('\n').length > 30) console.log('  ...');
    console.log('─'.repeat(40));
    console.log('');
  }

  // Show system prompt preview
  const promptPath = join(fullPath, 'system-prompt.md');
  if (existsSync(promptPath)) {
    const prompt = readFileSync(promptPath, 'utf8');
    console.log('🧠 System Prompt (preview):');
    console.log('─'.repeat(40));
    console.log(`  ${prompt.slice(0, 300).replace(/\n/g, '\n  ')}`);
    if (prompt.length > 300) console.log('  ...');
    console.log('─'.repeat(40));
    console.log('');
  }

  // Show prompts directory if present
  const promptsDir = join(fullPath, 'prompts');
  if (existsSync(promptsDir)) {
    const prompts = readdirSync(promptsDir);
    console.log(`📝 Skill Prompts: ${prompts.join(', ')}`);
    console.log('');
  }

  console.log('✅ Workspace components:');
  console.log('  • OAD config    → Agent identity & capabilities');
  console.log('  • System prompt → Base personality & knowledge');
  console.log('  • Prompts/      → Skill-specific instructions\n');
  console.log('Use with OPC Agent:');
  console.log('  import { loadOAD } from "opc-agent";');
  console.log(`  const config = loadOAD("${oadPath.replace(/\\/g, '/')}");\n`);
}

main();
