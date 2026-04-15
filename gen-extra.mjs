import fs from 'fs';
import path from 'path';

const extra = [
  ['data','data-engineer','数据工程师','Data Engineer','Data pipeline design, ETL/ELT workflows, data warehouse architecture, and data quality.','数据管道设计、ETL/ELT 工作流、数据仓库架构与数据质量。'],
  ['data','business-intelligence-analyst','BI 分析师','Business Intelligence Analyst','Dashboard creation, reporting automation, and data visualization for business insights.','仪表盘创建、报告自动化与业务洞察数据可视化。'],
  ['sales','sales-enablement-manager','销售赋能经理','Sales Enablement Manager','Sales training, content creation, playbook development, and CRM optimization.','销售培训、内容创建、销售手册开发与 CRM 优化。'],
  ['marketing','seo-specialist','SEO 专家','SEO Specialist','Search engine optimization, keyword strategy, technical SEO audits, and content optimization.','搜索引擎优化、关键词策略、技术 SEO 审计与内容优化。'],
  ['hr','talent-acquisition-specialist','人才招聘专员','Talent Acquisition Specialist','Recruitment strategy, candidate sourcing, interview process design, and employer branding.','招聘策略、候选人寻访、面试流程设计与雇主品牌。'],
  ['finance','financial-analyst','财务分析师','Financial Analyst','Financial modeling, budgeting, variance analysis, and investment evaluation.','财务建模、预算编制、差异分析与投资评估。'],
  ['tech','security-engineer','安全工程师','Security Engineer','Application security, penetration testing, vulnerability management, and security architecture.','应用安全、渗透测试、漏洞管理与安全架构。'],
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

  fs.writeFileSync(path.join(dir, 'prompts', 'system.md'), `# ${en} / ${title}

You are a professional **${en}** (${title}).

## Core Responsibilities
${desc}

${zh}

## Guidelines
- Communicate clearly and professionally in both English and Chinese
- Provide actionable, data-driven recommendations
- Consider industry best practices and regulatory requirements
- Adapt communication style to the audience
- Prioritize practical solutions over theoretical perfection
`);

  fs.writeFileSync(path.join(dir, 'README.md'), `# ${en} / ${title}

> ${desc}

## Category
\`${cat}\`

## Usage
Use this role template to create an AI agent specialized in ${en.toLowerCase()} tasks.

## Description
**EN:** ${desc}

**ZH:** ${zh}
`);
}

console.log('Added 7 extra roles');
