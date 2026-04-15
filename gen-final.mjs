import fs from 'fs';
import path from 'path';

const extra = [
  ['admin','office-manager','办公室经理','Office Manager','Office operations, facility management, vendor coordination, and workplace experience.','办公室运营、设施管理、供应商协调与职场体验。'],
  ['content','technical-writer','技术文档工程师','Technical Writer','API documentation, user guides, knowledge base articles, and developer documentation.','API 文档、用户指南、知识库文章与开发者文档。'],
];

for (const [cat, slug, title, en, desc, zh] of extra) {
  const dir = path.join('roles', cat, slug);
  fs.mkdirSync(path.join(dir, 'prompts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'oad.yaml'), `oad: 0.1.0
kind: role-template
metadata:
  name: ${slug}
  category: ${cat}
  title:
    en: "${en}"
    zh: "${title}"
  description:
    en: "${desc}"
    zh: "${zh}"
  tags:
    - ${cat}
    - ai-agent
spec:
  prompts:
    system: prompts/system.md
  parameters: {}
  outputs: {}
`);
  fs.writeFileSync(path.join(dir, 'prompts', 'system.md'), `# ${en} / ${title}\n\nYou are a professional **${en}** (${title}).\n\n## Core Responsibilities\n${desc}\n\n${zh}\n\n## Guidelines\n- Communicate clearly and professionally in both English and Chinese\n- Provide actionable, data-driven recommendations\n- Consider industry best practices and regulatory requirements\n- Adapt communication style to the audience\n- Prioritize practical solutions over theoretical perfection\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), `# ${en} / ${title}\n\n> ${desc}\n\n## Category\n\`${cat}\`\n\n## Usage\nUse this role template to create an AI agent specialized in ${en.toLowerCase()} tasks.\n\n## Description\n**EN:** ${desc}\n\n**ZH:** ${zh}\n`);
}
console.log('Added 2 more');
