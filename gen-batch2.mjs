import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const roles = [
  { cat: 'legal', id: 'contract-reviewer', en: 'Contract Reviewer', zh: '合同审查专员', skills: ['contract-analysis', 'risk-identification', 'clause-comparison'], metrics: ['review_accuracy', 'turnaround_time', 'risk_detection_rate'] },
  { cat: 'legal', id: 'compliance-officer', en: 'Compliance Officer', zh: '合规专员', skills: ['regulation-monitoring', 'compliance-audit', 'policy-drafting'], metrics: ['compliance_rate', 'audit_completion', 'violation_detection'] },
  { cat: 'legal', id: 'legal-researcher', en: 'Legal Researcher', zh: '法律研究员', skills: ['case-law-search', 'statute-analysis', 'legal-memo-drafting'], metrics: ['research_accuracy', 'citation_quality', 'response_time'] },
  { cat: 'operations', id: 'inventory-manager', en: 'Inventory Manager', zh: '库存管理专员', skills: ['stock-tracking', 'reorder-optimization', 'demand-forecasting'], metrics: ['stockout_rate', 'inventory_turnover', 'forecast_accuracy'] },
  { cat: 'operations', id: 'logistics-coordinator', en: 'Logistics Coordinator', zh: '物流协调员', skills: ['shipment-tracking', 'route-optimization', 'carrier-management'], metrics: ['on_time_delivery', 'shipping_cost', 'damage_rate'] },
  { cat: 'operations', id: 'quality-inspector', en: 'Quality Inspector', zh: '质检员', skills: ['defect-detection', 'standard-compliance', 'inspection-reporting'], metrics: ['defect_rate', 'inspection_throughput', 'false_positive_rate'] },
  { cat: 'product', id: 'product-manager', en: 'Product Manager', zh: '产品经理', skills: ['requirement-analysis', 'roadmap-planning', 'stakeholder-communication', 'competitive-analysis'], metrics: ['feature_adoption', 'user_satisfaction', 'time_to_market'] },
  { cat: 'product', id: 'ux-researcher', en: 'UX Researcher', zh: '用户研究员', skills: ['user-interview', 'usability-testing', 'survey-design', 'insight-synthesis'], metrics: ['research_quality', 'actionable_insights', 'participant_satisfaction'] },
  { cat: 'product', id: 'product-analyst', en: 'Product Analyst', zh: '产品分析师', skills: ['data-analysis', 'funnel-optimization', 'ab-testing', 'metric-tracking'], metrics: ['analysis_accuracy', 'insight_impact', 'report_timeliness'] },
  { cat: 'design', id: 'ui-designer', en: 'UI Designer', zh: 'UI设计师', skills: ['interface-design', 'design-system', 'prototype-creation', 'accessibility-audit'], metrics: ['design_consistency', 'usability_score', 'iteration_speed'] },
  { cat: 'design', id: 'brand-designer', en: 'Brand Designer', zh: '品牌设计师', skills: ['brand-identity', 'visual-guideline', 'asset-creation'], metrics: ['brand_consistency', 'creative_quality', 'delivery_speed'] },
  { cat: 'education', id: 'online-tutor', en: 'Online Tutor', zh: '在线辅导老师', skills: ['knowledge-assessment', 'adaptive-teaching', 'progress-tracking', 'question-answering'], metrics: ['student_improvement', 'engagement_rate', 'satisfaction_score'] },
  { cat: 'education', id: 'course-designer', en: 'Course Designer', zh: '课程设计师', skills: ['curriculum-design', 'learning-objective', 'content-structuring', 'assessment-creation'], metrics: ['learning_outcome', 'completion_rate', 'content_quality'] },
  { cat: 'education', id: 'training-coordinator', en: 'Training Coordinator', zh: '培训协调员', skills: ['schedule-management', 'trainer-matching', 'feedback-collection'], metrics: ['training_completion', 'participant_satisfaction', 'scheduling_efficiency'] },
  { cat: 'healthcare', id: 'patient-coordinator', en: 'Patient Coordinator', zh: '患者协调员', skills: ['appointment-scheduling', 'patient-communication', 'record-management'], metrics: ['scheduling_efficiency', 'patient_satisfaction', 'wait_time_reduction'] },
  { cat: 'healthcare', id: 'health-advisor', en: 'Health Advisor', zh: '健康顾问', skills: ['health-assessment', 'wellness-recommendation', 'lifestyle-coaching'], metrics: ['advice_accuracy', 'patient_adherence', 'health_outcome'] },
  { cat: 'admin', id: 'office-manager', en: 'Office Manager', zh: '行政经理', skills: ['facility-management', 'vendor-coordination', 'budget-tracking', 'event-planning'], metrics: ['operational_efficiency', 'cost_savings', 'employee_satisfaction'] },
  { cat: 'admin', id: 'executive-assistant', en: 'Executive Assistant', zh: '行政助理', skills: ['calendar-management', 'email-drafting', 'meeting-preparation', 'travel-arrangement'], metrics: ['response_time', 'scheduling_accuracy', 'task_completion'] },
  { cat: 'admin', id: 'travel-coordinator', en: 'Travel Coordinator', zh: '差旅协调员', skills: ['itinerary-planning', 'booking-management', 'expense-tracking', 'policy-compliance'], metrics: ['cost_savings', 'booking_accuracy', 'traveler_satisfaction'] },
  { cat: 'customer-service', id: 'vip-account-manager', en: 'VIP Account Manager', zh: 'VIP客户经理', skills: ['relationship-management', 'personalized-service', 'upselling', 'complaint-resolution'], metrics: ['retention_rate', 'customer_lifetime_value', 'satisfaction_score'] },
];

const base = process.cwd();

for (const r of roles) {
  const dir = join(base, 'roles', r.cat, r.id);
  const promptDir = join(dir, 'prompts');
  mkdirSync(promptDir, { recursive: true });

  // oad.yaml
  const skillsYaml = r.skills.map(s => `    - name: ${s}\n      description: "${s.replace(/-/g, ' ')}"`).join('\n');
  const metricsYaml = r.metrics.map(m => m).join(', ');
  writeFileSync(join(dir, 'oad.yaml'), `apiVersion: opc/v1
kind: Agent
metadata:
  name: ${r.id}
  version: 1.0.0
  description: "AI ${r.en}"
  author: "Deepleaper Community"
  license: Apache-2.0
  marketplace:
    category: ${r.cat}
    tags: [${r.cat}, ${r.id.split('-').join(', ')}]
spec:
  provider:
    default: deepseek
    allowed: [openai, deepseek, qwen, claude]
  model: deepseek-chat
  systemPrompt: "@prompts/system.md"
  skills:
${skillsYaml}
  channels:
    - type: web
      port: 3000
  memory:
    shortTerm: true
    longTerm:
      provider: deepbrain
  dtv:
    trust:
      level: sandbox
    value:
      metrics: [${metricsYaml}]
`);

  // system.md
  writeFileSync(join(promptDir, 'system.md'), `# ${r.en} / ${r.zh}

## Role Description / 角色描述

You are an AI ${r.en} (${r.zh}). You specialize in ${r.cat.replace(/-/g, ' ')} operations and provide professional assistance in your domain.

你是一个 AI ${r.zh}，专注于${r.cat.replace(/-/g, '')}领域的专业工作，为用户提供高质量的服务和建议。

## Key Responsibilities / 核心职责

${r.skills.map((s, i) => `${i + 1}. **${s.replace(/-/g, ' ')}**: Perform ${s.replace(/-/g, ' ')} tasks efficiently and accurately.\n   执行${s.replace(/-/g, '')}相关任务，确保高效准确。`).join('\n')}

## Communication Style / 沟通风格

- Professional and courteous in all interactions
- Provide clear, actionable recommendations
- Ask clarifying questions when requirements are ambiguous
- Present information in a structured, easy-to-understand format

- 所有交互保持专业和礼貌
- 提供清晰、可执行的建议
- 需求不明确时主动询问
- 以结构化、易理解的方式呈现信息

## Domain Knowledge / 专业知识

You have deep expertise in ${r.cat.replace(/-/g, ' ')} best practices, industry standards, and common workflows. You stay current with the latest trends and regulations in your field.

你具备${r.cat.replace(/-/g, '')}领域的深厚专业知识，熟悉行业最佳实践、标准和常见工作流程，并持续跟踪该领域的最新趋势和法规。

## Constraints / 约束

- Always verify critical information before providing advice
- Clearly state when you are uncertain about something
- Respect privacy and confidentiality
- Escalate to human experts when the situation requires it

- 提供建议前验证关键信息
- 不确定时明确说明
- 尊重隐私和保密性
- 超出能力范围时转交人类专家
`);

  // README.md
  writeFileSync(join(dir, 'README.md'), `# ${r.en} / ${r.zh}

> AI-powered ${r.en.toLowerCase()} agent for ${r.cat.replace(/-/g, ' ')} operations.

## Quick Start

\`\`\`bash
opc init --from agent-workstation/${r.cat}/${r.id}
opc run
\`\`\`

## Skills

${r.skills.map(s => `- **${s}**: ${s.replace(/-/g, ' ')}`).join('\n')}

## Metrics

${r.metrics.map(m => `- \`${m}\``).join('\n')}

## License

Apache-2.0 — [Deepleaper](https://github.com/Deepleaper)
`);
}

console.log(\`Generated \${roles.length} role templates.\`);
