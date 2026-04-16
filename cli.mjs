#!/usr/bin/env node
/**
 * Agent Workstation CLI
 * 浏览和搜索 849+ AI Agent 岗位模板
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROLES_DIR = join(__dirname, 'roles');
const [,, cmd, ...args] = process.argv;

function listCategories() {
  const cats = readdirSync(ROLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const roles = readdirSync(join(ROLES_DIR, d.name), { withFileTypes: true })
        .filter(f => f.isDirectory()).length;
      return { name: d.name, count: roles };
    });
  console.log('\n📁 岗位分类 (' + cats.reduce((s, c) => s + c.count, 0) + ' 个模板)\n');
  for (const c of cats) {
    console.log(`  ${c.name.padEnd(20)} ${c.count} 个岗位`);
  }
  console.log('\n使用 `workstation list <分类>` 查看详情');
}

function listRoles(category) {
  const catDir = join(ROLES_DIR, category);
  if (!existsSync(catDir)) {
    console.error(`❌ 分类 "${category}" 不存在`);
    listCategories();
    return;
  }
  const roles = readdirSync(catDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  console.log(`\n📋 ${category} (${roles.length} 个岗位)\n`);
  for (const r of roles) {
    console.log(`  ${r}`);
  }
}

function searchRoles(query) {
  const q = query.toLowerCase();
  const results = [];
  const cats = readdirSync(ROLES_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const cat of cats) {
    const roles = readdirSync(join(ROLES_DIR, cat.name), { withFileTypes: true })
      .filter(d => d.isDirectory());
    for (const role of roles) {
      if (role.name.toLowerCase().includes(q)) {
        results.push({ category: cat.name, role: role.name });
      }
    }
  }
  if (results.length === 0) {
    console.log(`❌ 没有找到匹配 "${query}" 的岗位`);
  } else {
    console.log(`\n🔍 搜索 "${query}" (${results.length} 个结果)\n`);
    for (const r of results) {
      console.log(`  ${r.category}/${r.role}`);
    }
  }
}

function showRole(path) {
  const rolePath = join(ROLES_DIR, path);
  const readmePath = join(rolePath, 'README.md');
  if (existsSync(readmePath)) {
    console.log(readFileSync(readmePath, 'utf8'));
  } else {
    const files = readdirSync(rolePath);
    console.log(`\n📄 ${path} 包含: ${files.join(', ')}`);
  }
}

function showHelp() {
  console.log(`
🏢 Agent Workstation — AI Agent 岗位模板库

命令:
  workstation                  列出所有分类
  workstation list <分类>      列出分类下的岗位
  workstation search <关键词>  搜索岗位
  workstation show <路径>      查看岗位详情
  workstation help             显示帮助
`);
}

switch (cmd) {
  case 'list': args[0] ? listRoles(args[0]) : listCategories(); break;
  case 'search': searchRoles(args.join(' ')); break;
  case 'show': showRole(args.join('/')); break;
  case 'help': case '--help': case '-h': showHelp(); break;
  default: listCategories(); break;
}
