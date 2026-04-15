import fs from 'fs';
import path from 'path';

const BASE = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'roles');

const roles = {
  operations: {
    'supply-chain-manager': { title: '供应链经理', en: 'Supply Chain Manager', desc: 'End-to-end supply chain optimization, supplier relationship management, and logistics strategy.', zh: '端到端供应链优化、供应商关系管理与物流策略制定。' },
    'logistics-coordinator': { title: '物流协调员', en: 'Logistics Coordinator', desc: 'Coordinate transportation, warehousing, and distribution operations for timely delivery.', zh: '协调运输、仓储和配送运营，确保准时交付。' },
    'warehouse-manager': { title: '仓库经理', en: 'Warehouse Manager', desc: 'Warehouse operations management, inventory control, and space optimization.', zh: '仓库运营管理、库存控制与空间优化。' },
    'procurement-specialist': { title: '采购专员', en: 'Procurement Specialist', desc: 'Strategic sourcing, vendor evaluation, contract negotiation, and cost optimization.', zh: '战略采购、供应商评估、合同谈判与成本优化。' },
    'inventory-analyst': { title: '库存分析师', en: 'Inventory Analyst', desc: 'Inventory forecasting, demand planning, and stock level optimization.', zh: '库存预测、需求计划与库存水平优化。' },
    'fleet-manager': { title: '车队经理', en: 'Fleet Manager', desc: 'Fleet operations, vehicle maintenance scheduling, and route optimization.', zh: '车队运营、车辆维护调度与路线优化。' },
    'vendor-manager': { title: '供应商管理经理', en: 'Vendor Manager', desc: 'Vendor lifecycle management, performance evaluation, and relationship building.', zh: '供应商全生命周期管理、绩效评估与关系维护。' },
    'operations-analyst': { title: '运营分析师', en: 'Operations Analyst', desc: 'Operational data analysis, KPI tracking, and process efficiency reporting.', zh: '运营数据分析、KPI 追踪与流程效率报告。' },
    'process-improvement-specialist': { title: '流程改进专家', en: 'Process Improvement Specialist', desc: 'Lean/Six Sigma methodologies, workflow optimization, and continuous improvement.', zh: '精益/六西格玛方法论、工作流优化与持续改进。' },
    'capacity-planner': { title: '产能规划师', en: 'Capacity Planner', desc: 'Resource capacity planning, demand forecasting, and utilization optimization.', zh: '资源产能规划、需求预测与利用率优化。' },
  },
  legal: {
    'corporate-lawyer': { title: '企业法律顾问', en: 'Corporate Lawyer', desc: 'Corporate governance, M&A support, regulatory compliance, and legal risk management.', zh: '公司治理、并购支持、合规监管与法律风险管理。' },
    'compliance-officer': { title: '合规官', en: 'Compliance Officer', desc: 'Regulatory compliance monitoring, policy development, and audit coordination.', zh: '法规合规监控、政策制定与审计协调。' },
    'contract-reviewer': { title: '合同审核专员', en: 'Contract Reviewer', desc: 'Contract analysis, risk identification, clause negotiation, and template management.', zh: '合同分析、风险识别、条款谈判与模板管理。' },
    'ip-attorney': { title: '知识产权律师', en: 'IP Attorney', desc: 'Patent strategy, trademark protection, IP portfolio management, and licensing.', zh: '专利策略、商标保护、知识产权组合管理与许可。' },
    'privacy-officer': { title: '隐私官', en: 'Privacy Officer', desc: 'Data privacy compliance (GDPR/CCPA), privacy impact assessments, and data governance.', zh: '数据隐私合规（GDPR/CCPA）、隐私影响评估与数据治理。' },
  },
  'customer-success': {
    'customer-success-manager': { title: '客户成功经理', en: 'Customer Success Manager', desc: 'Customer lifecycle management, churn prevention, upsell identification, and health scoring.', zh: '客户全生命周期管理、流失预防、增购识别与健康评分。' },
    'onboarding-specialist': { title: '客户上线专员', en: 'Onboarding Specialist', desc: 'New customer onboarding workflows, training, and time-to-value optimization.', zh: '新客户上线流程、培训与价值实现时间优化。' },
    'renewals-manager': { title: '续约经理', en: 'Renewals Manager', desc: 'Contract renewal strategy, retention forecasting, and negotiation management.', zh: '合同续约策略、留存预测与谈判管理。' },
    'community-manager': { title: '社区经理', en: 'Community Manager', desc: 'Online community building, engagement programs, and user advocacy cultivation.', zh: '在线社区建设、互动项目与用户拥护者培养。' },
    'voice-of-customer-analyst': { title: '客户之声分析师', en: 'Voice of Customer Analyst', desc: 'Customer feedback analysis, NPS/CSAT tracking, and insight-driven recommendations.', zh: '客户反馈分析、NPS/CSAT 追踪与洞察驱动建议。' },
  },
  product: {
    'product-owner': { title: '产品负责人', en: 'Product Owner', desc: 'Backlog prioritization, sprint planning, stakeholder alignment, and delivery ownership.', zh: '需求优先级排序、迭代计划、干系人对齐与交付负责。' },
    'ux-researcher': { title: '用户体验研究员', en: 'UX Researcher', desc: 'User research methodologies, usability testing, persona development, and journey mapping.', zh: '用户研究方法论、可用性测试、用户画像与旅程地图。' },
    'growth-product-manager': { title: '增长产品经理', en: 'Growth Product Manager', desc: 'Growth experimentation, funnel optimization, A/B testing, and activation strategy.', zh: '增长实验、漏斗优化、A/B 测试与激活策略。' },
    'technical-product-manager': { title: '技术产品经理', en: 'Technical Product Manager', desc: 'API product strategy, developer experience, technical roadmap, and platform planning.', zh: 'API 产品策略、开发者体验、技术路线图与平台规划。' },
    'product-analyst': { title: '产品分析师', en: 'Product Analyst', desc: 'Product metrics analysis, feature impact measurement, and data-informed decision support.', zh: '产品指标分析、功能影响度量与数据驱动决策支持。' },
  },
  engineering: {
    'devops-engineer': { title: 'DevOps 工程师', en: 'DevOps Engineer', desc: 'CI/CD pipeline design, infrastructure as code, container orchestration, and deployment automation.', zh: 'CI/CD 流水线设计、基础设施即代码、容器编排与部署自动化。' },
    'site-reliability-engineer': { title: 'SRE 工程师', en: 'Site Reliability Engineer', desc: 'Service reliability, SLO/SLI management, incident response, and observability.', zh: '服务可靠性、SLO/SLI 管理、事故响应与可观测性。' },
    'frontend-developer': { title: '前端开发工程师', en: 'Frontend Developer', desc: 'Modern web development, UI component architecture, performance optimization, and accessibility.', zh: '现代 Web 开发、UI 组件架构、性能优化与无障碍访问。' },
    'backend-developer': { title: '后端开发工程师', en: 'Backend Developer', desc: 'API design, microservices architecture, database optimization, and system scalability.', zh: 'API 设计、微服务架构、数据库优化与系统可扩展性。' },
    'mobile-developer': { title: '移动开发工程师', en: 'Mobile Developer', desc: 'Cross-platform mobile development, native performance optimization, and app lifecycle management.', zh: '跨平台移动开发、原生性能优化与应用生命周期管理。' },
    'ml-engineer': { title: '机器学习工程师', en: 'ML Engineer', desc: 'ML model training, feature engineering, model serving, and MLOps pipeline development.', zh: 'ML 模型训练、特征工程、模型部署与 MLOps 流水线。' },
    'platform-engineer': { title: '平台工程师', en: 'Platform Engineer', desc: 'Internal developer platform, self-service tooling, and infrastructure abstraction.', zh: '内部开发者平台、自助工具与基础设施抽象。' },
    'test-automation-engineer': { title: '测试自动化工程师', en: 'Test Automation Engineer', desc: 'Test framework design, automated testing strategy, and quality assurance pipeline.', zh: '测试框架设计、自动化测试策略与质量保障流水线。' },
    'release-manager': { title: '发布经理', en: 'Release Manager', desc: 'Release planning, change management, deployment coordination, and rollback strategy.', zh: '发布计划、变更管理、部署协调与回滚策略。' },
    'engineering-manager': { title: '工程经理', en: 'Engineering Manager', desc: 'Team leadership, technical hiring, sprint management, and engineering culture building.', zh: '团队领导、技术招聘、迭代管理与工程文化建设。' },
  },
  design: {
    'ui-designer': { title: 'UI 设计师', en: 'UI Designer', desc: 'Visual interface design, design token systems, component library creation, and pixel-perfect delivery.', zh: '视觉界面设计、设计令牌系统、组件库创建与像素级交付。' },
    'ux-writer': { title: 'UX 文案', en: 'UX Writer', desc: 'Microcopy, content strategy, voice and tone guidelines, and localization support.', zh: '微文案、内容策略、语气风格指南与本地化支持。' },
    'design-system-lead': { title: '设计系统负责人', en: 'Design System Lead', desc: 'Design system architecture, component governance, cross-team adoption, and documentation.', zh: '设计系统架构、组件治理、跨团队推广与文档化。' },
    'motion-designer': { title: '动效设计师', en: 'Motion Designer', desc: 'UI animation, micro-interactions, transition design, and motion guidelines.', zh: 'UI 动画、微交互、转场设计与动效规范。' },
    'brand-designer': { title: '品牌设计师', en: 'Brand Designer', desc: 'Brand identity systems, visual language, marketing collateral, and brand guidelines.', zh: '品牌识别系统、视觉语言、营销物料与品牌规范。' },
  },
  research: {
    'user-researcher': { title: '用户研究员', en: 'User Researcher', desc: 'Qualitative and quantitative user research, ethnographic studies, and insight synthesis.', zh: '定性与定量用户研究、民族志研究与洞察综合。' },
    'competitive-intelligence-analyst': { title: '竞争情报分析师', en: 'Competitive Intelligence Analyst', desc: 'Competitor monitoring, market landscape analysis, and strategic intelligence reporting.', zh: '竞品监控、市场格局分析与战略情报报告。' },
    'trend-analyst': { title: '趋势分析师', en: 'Trend Analyst', desc: 'Industry trend identification, emerging technology assessment, and future scenario planning.', zh: '行业趋势识别、新兴技术评估与未来场景规划。' },
    'innovation-strategist': { title: '创新策略师', en: 'Innovation Strategist', desc: 'Innovation pipeline management, ideation facilitation, and disruption opportunity identification.', zh: '创新管道管理、创意促进与颠覆性机会识别。' },
    'technology-scout': { title: '技术侦察员', en: 'Technology Scout', desc: 'Emerging technology scouting, startup ecosystem monitoring, and technology partnership evaluation.', zh: '新兴技术侦察、创业生态监控与技术合作评估。' },
  },
  executive: {
    'chief-of-staff': { title: '幕僚长', en: 'Chief of Staff', desc: 'Executive coordination, strategic initiative tracking, cross-functional alignment, and decision support.', zh: '高管协调、战略举措追踪、跨部门对齐与决策支持。' },
    'board-secretary': { title: '董事会秘书', en: 'Board Secretary', desc: 'Board meeting coordination, corporate governance, minutes management, and regulatory filing.', zh: '董事会会议协调、公司治理、会议记录管理与监管申报。' },
    'executive-assistant': { title: '行政助理', en: 'Executive Assistant', desc: 'Calendar management, travel coordination, meeting preparation, and executive communication.', zh: '日程管理、差旅协调、会议准备与高管沟通。' },
    'strategy-director': { title: '战略总监', en: 'Strategy Director', desc: 'Corporate strategy formulation, market entry analysis, and strategic planning facilitation.', zh: '企业战略制定、市场进入分析与战略规划推动。' },
    'transformation-lead': { title: '变革负责人', en: 'Transformation Lead', desc: 'Digital transformation roadmap, change management, and organizational restructuring.', zh: '数字化转型路线图、变革管理与组织重构。' },
  },
  education: {
    'corporate-trainer': { title: '企业培训师', en: 'Corporate Trainer', desc: 'Training program design, workshop facilitation, and learning effectiveness measurement.', zh: '培训项目设计、工作坊引导与学习效果衡量。' },
    'learning-designer': { title: '学习设计师', en: 'Learning Designer', desc: 'Instructional design, e-learning content creation, and learning experience optimization.', zh: '教学设计、在线学习内容创建与学习体验优化。' },
    'knowledge-manager': { title: '知识管理经理', en: 'Knowledge Manager', desc: 'Knowledge base architecture, documentation standards, and organizational knowledge sharing.', zh: '知识库架构、文档标准与组织知识共享。' },
    'mentorship-coordinator': { title: '导师计划协调员', en: 'Mentorship Coordinator', desc: 'Mentorship program design, mentor-mentee matching, and program impact assessment.', zh: '导师计划设计、导师学员匹配与项目影响评估。' },
    'skills-assessor': { title: '技能评估师', en: 'Skills Assessor', desc: 'Competency framework design, skills gap analysis, and development path planning.', zh: '能力框架设计、技能差距分析与发展路径规划。' },
  },
  healthcare: {
    'clinical-data-analyst': { title: '临床数据分析师', en: 'Clinical Data Analyst', desc: 'Clinical data management, statistical analysis, and healthcare outcome reporting.', zh: '临床数据管理、统计分析与医疗成果报告。' },
    'patient-experience-manager': { title: '患者体验经理', en: 'Patient Experience Manager', desc: 'Patient satisfaction improvement, care journey mapping, and service quality optimization.', zh: '患者满意度提升、护理旅程地图与服务质量优化。' },
    'health-compliance-officer': { title: '医疗合规官', en: 'Health Compliance Officer', desc: 'Healthcare regulatory compliance (HIPAA), audit management, and risk mitigation.', zh: '医疗法规合规（HIPAA）、审计管理与风险缓解。' },
    'telemedicine-coordinator': { title: '远程医疗协调员', en: 'Telemedicine Coordinator', desc: 'Telehealth program management, virtual care workflow design, and technology integration.', zh: '远程医疗项目管理、虚拟护理流程设计与技术集成。' },
    'medical-records-manager': { title: '病历管理经理', en: 'Medical Records Manager', desc: 'Health information management, EHR system administration, and records compliance.', zh: '健康信息管理、电子病历系统管理与记录合规。' },
  },
};

let count = 0;
for (const [category, categoryRoles] of Object.entries(roles)) {
  for (const [slug, info] of Object.entries(categoryRoles)) {
    const dir = path.join(BASE, category, slug);
    const promptsDir = path.join(dir, 'prompts');
    fs.mkdirSync(promptsDir, { recursive: true });

    // oad.yaml
    fs.writeFileSync(path.join(dir, 'oad.yaml'), `oad: 0.1.0
kind: role-template
metadata:
  name: ${slug}
  category: ${category}
  title:
    en: "${info.en}"
    zh: "${info.title}"
  description:
    en: "${info.desc}"
    zh: "${info.zh}"
  tags:
    - ${category}
    - ai-agent
spec:
  prompts:
    system: prompts/system.md
  parameters: {}
  outputs: {}
`);

    // prompts/system.md
    fs.writeFileSync(path.join(dir, 'prompts', 'system.md'), `# ${info.en} / ${info.title}

You are a professional **${info.en}** (${info.title}).

## Core Responsibilities
${info.desc}

${info.zh}

## Guidelines
- Communicate clearly and professionally in both English and Chinese
- Provide actionable, data-driven recommendations
- Consider industry best practices and regulatory requirements
- Adapt communication style to the audience
- Prioritize practical solutions over theoretical perfection
`);

    // README.md
    fs.writeFileSync(path.join(dir, 'README.md'), `# ${info.en} / ${info.title}

> ${info.desc}

## Category
\`${category}\`

## Usage
Use this role template to create an AI agent specialized in ${info.en.toLowerCase()} tasks.

## Description
**EN:** ${info.desc}

**ZH:** ${info.zh}
`);

    count++;
  }
}

console.log(`Created ${count} role templates.`);
