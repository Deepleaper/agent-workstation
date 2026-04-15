import fs from 'fs';
import path from 'path';
const cat='customer-service', slug='escalation-manager', title='升级处理经理', en='Escalation Manager', desc='Customer escalation handling, conflict resolution, and service recovery management.', zh='客户升级处理、冲突解决与服务恢复管理。';
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
fs.writeFileSync(path.join(dir, 'prompts', 'system.md'), `# ${en} / ${title}\n\nYou are a professional **${en}** (${title}).\n\n## Core Responsibilities\n${desc}\n\n${zh}\n\n## Guidelines\n- Communicate clearly and professionally\n- Provide actionable recommendations\n- Consider best practices\n- Prioritize practical solutions\n`);
fs.writeFileSync(path.join(dir, 'README.md'), `# ${en} / ${title}\n\n> ${desc}\n\n## Category\n\`${cat}\`\n`);
console.log('Added 1 more');
