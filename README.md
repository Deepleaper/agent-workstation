<div align="center">

# 👤 Agent Workstation

**Agent Templates — 100+ 自带知识种子的专业角色模板，不是从零开始**

[![npm version](https://img.shields.io/badge/npm-v2.1.0-blue)](https://www.npmjs.com/package/agent-workstation)
[![License](https://img.shields.io/badge/License-LGPL_3.0-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-143_passing-brightgreen)]()

Not empty scaffolds. Every role ships with **Brain Seeds** — Agents don't start from zero, they're born with industry knowledge, then continue to self-evolve through learn → recall → evolve.<br/>
Agent Workstation 是 The Self-Evolving Agent Stack 中的 **Agent Templates** 层。开发者使用路径：① **选模板 (Agent Templates)** → ② 接模型 (Agent Model Layer) → ③ 跑起来 (Agent Runtime) → ④ 自动进化 (Agent Memory)。<br/>
20 个角色已配备专业 system prompt + 行业知识种子 + 完整 OAD 配置。其余 80 个骨架模板持续补全中。

[快速开始](#-快速开始) · [角色列表](#-完整角色列表20-个生产就绪) · [API](#-api-reference) · [English](#english)

</div>

---

## 🏗️ 三层知识架构 (3-Tier Knowledge Architecture)

Agent Workstation v1.4.0 的核心能力——三层知识种子体系，让每个 Agent 创建即有行业记忆：

```
🏭 行业知识 (Industry)    → 19 个行业分类
💼 岗位知识 (Job)         → 100 个岗位角色
🔧 模板知识 (Workstation) → 100 个模板场景
```

### 🔄 自进化飞轮 (Self-Evolution Flywheel)

Agent 不是从零开始——带着知识种子出生，然后越用越聪明：

```
┌─────────────────────────────────────────────────┐
│  🌱 Brain Seed（知识种子）→ Agent 带着行业知识出生  │
│       ↓                                          │
│  📥 learn() — 日常使用中自动积累经验                │
│       ↓                                          │
│  🧬 evolve() — 自动提炼为更精华的知识               │
│       ↓                                          │
│  📈 新的经验反哺知识种子，下一个 Agent 起步更高       │
│       ↓                                          │
│  → 回到顶部，越转越快 🔄                           │
└─────────────────────────────────────────────────┘
```

越多 Agent 使用 → 知识越丰富 → 新 Agent 起步越高 → 整个生态越智能。

---

## ⚡ 快速开始

### 配合 OPC Agent CLI

```bash
npm install -g opc-agent
opc init my-agent --role customer-service-rep
# → 自动生成: SOUL.md + agent.yaml + CONTEXT.md + brain-seed.md
```

### 编程使用

```typescript
import { searchRoles, getPopularRoles, getCategories } from 'agent-workstation';

// 模糊搜索
const roles = searchRoles('developer');
console.log(roles);
// → [{ category: 'engineering', role: 'backend-developer', score: 110 }, ...]

// 获取热门角色
const popular = getPopularRoles();

// 浏览分类
const categories = getCategories();
```

---

## ✨ 核心特性

| | 特性 | 说明 |
|---|---|---|
| 👤 | **20 个生产就绪角色** | 每个含 50–80 行 rich system prompt，开箱即用 |
| 🧠 | **Brain Seed 知识种子** | Agent 创建即有行业记忆，无冷启动 |
| 🏭 | **三层分类体系** | 行业 → 职能 → 工位，19 个职能方向 |
| 🔍 | **模糊搜索** | `searchRoles('customer')` 智能匹配角色名、描述 |
| ✅ | **模板校验** | `validateRole()` 检查完整性，给出错误/警告 |
| 🎨 | **Web UI** | 内置角色浏览器 + 模板预览（`WorkstationUI`） |
| 📦 | **OPC Agent 深度集成** | `opc init --role` 一键生成完整 Agent 工作空间 |

---

## 📋 完整角色列表（20 个生产就绪）

| 角色 | 职能 | Prompt 行数 | Brain Seed |
|------|------|:-----------:|:----------:|
| customer-service-rep | Customer Service | 71 | ✅ |
| complaint-handler | Customer Service | 71 | ✅ |
| live-chat-agent | Customer Service | 71 | ✅ |
| backend-developer | Engineering | 82 | ✅ |
| product-manager | Product | 79 | ✅ |
| content-marketer | Marketing | 78 | ✅ |
| corporate-lawyer | Legal | 77 | ✅ |
| financial-analyst | Finance | 73 | ✅ |
| data-analyst | Data | 71 | ✅ |
| operations-analyst | Operations | 71 | ✅ |
| sales-development-rep | Sales | 71 | ✅ |
| hr-coordinator | HR | 71 | — |
| tax-preparer | Finance | 71 | — |
| recruiter | HR | 69 | ✅ |
| onboarding-specialist | HR | 69 | — |
| copywriter | Content | 69 | ✅ |
| accounts-payable-clerk | Finance | 69 | — |
| social-media-manager | Marketing | 69 | — |
| account-executive | Sales | 69 | — |
| sales-analyst | Sales | 69 | — |

> 另有 **80 个骨架模板**（含 OAD 配置，prompt 补全中），覆盖 admin、design、education、executive、healthcare、tech 等全部 19 个职能。

---

## 🏗️ 三层分类体系

```
行业 (11)  →  职能 (19)  →  工位 (100)

Technology     Engineering     backend-developer, frontend-developer, devops-engineer ...
               Product         product-manager, product-owner ...
               Data            data-analyst, data-engineer ...

E-commerce     Sales           sales-development-rep, account-executive ...
               Marketing       content-marketer, social-media-manager ...
               Customer Svc    customer-service-rep, complaint-handler ...

Finance        Finance         financial-analyst, tax-preparer ...
               Legal           corporate-lawyer, compliance-officer ...
```

<details>
<summary><b>全部 19 个职能及模板数</b></summary>

| 职能 | 模板数 | 示例角色 |
|------|:------:|---------|
| 💻 Engineering | 10 | backend-developer, frontend-developer, devops-engineer, ml-engineer |
| 📦 Product | 6 | product-manager, product-owner, ux-researcher |
| 📊 Data | 4 | data-analyst, data-engineer, business-intelligence-analyst |
| 🛒 Sales | 4 | sales-development-rep, account-executive, sales-analyst |
| 📢 Marketing | 3 | content-marketer, social-media-manager, seo-specialist |
| 💬 Customer Service | 5 | customer-service-rep, complaint-handler, live-chat-agent |
| 🎯 Customer Success | 5 | customer-success-manager, onboarding-specialist |
| 📝 Content | 2 | copywriter, technical-writer |
| 🎨 Design | 5 | ui-designer, brand-designer, ux-writer |
| 💰 Finance | 3 | financial-analyst, accounts-payable-clerk, tax-preparer |
| 👥 HR | 4 | recruiter, hr-coordinator, onboarding-specialist |
| ⚖️ Legal | 6 | corporate-lawyer, compliance-officer, contract-reviewer |
| ⚙️ Operations | 12 | operations-analyst, logistics-coordinator, supply-chain-manager |
| 🔬 Research | 5 | trend-analyst, competitive-intelligence-analyst |
| 🎓 Education | 8 | course-designer, corporate-trainer, knowledge-manager |
| 🏥 Healthcare | 7 | patient-coordinator, health-advisor, clinical-data-analyst |
| 👔 Executive | 5 | chief-of-staff, strategy-director |
| 🛡️ Admin | 3 | executive-assistant, office-manager |
| 💻 Tech | 3 | code-reviewer, security-engineer |

</details>

---

## 🧠 三层知识架构 (3-Tier Brain Seeds)

每个角色拥有三层知识种子，从通用到具体层层递进：

```
roles/
├── tech/                              ← 行业分类
│   ├── brain-seed.md                  ← 🏭 行业级知识 (Industry)
│   ├── frontend-developer/
│   │   ├── brain-seed.md              ← 💼 岗位级知识 (Job)
│   │   ├── workstation-seed.md        ← 🔧 模板级知识 (Workstation)
│   │   └── system-prompt.md
```

| 层级 | 文件 | 内容 | 示例 |
|------|------|------|------|
| 🏭 行业级 | `roles/{category}/brain-seed.md` | 行业概览、核心概念、最佳实践、KPI、法规、趋势 | 软件工程行业的 CI/CD、云原生、DORA 指标 |
| 💼 岗位级 | `roles/{category}/{role}/brain-seed.md` | 岗位专业知识、技能框架、方法论 | 前端开发的 React/Vue、性能优化、可访问性 |
| 🔧 模板级 | `roles/{category}/{role}/workstation-seed.md` | 典型场景、SOP、常见问题、质量标准、新人指南 | 前端工位的 Code Review 流程、Lighthouse 标准 |

当 `opc init --role frontend-developer` 时，自动生成：

```
my-agent/
├── brain-seeds/
│   ├── industry.md         ← 来自 tech/brain-seed.md
│   ├── job.md              ← 来自 tech/frontend-developer/brain-seed.md
│   └── workstation.md      ← 来自 tech/frontend-developer/workstation-seed.md
├── context.md              ← 空模板，填写公司特定知识
├── SOUL.md
└── agent.yaml
```

### API 使用

```typescript
import { getBrainSeeds, getIndustryBrainSeed, getWorkstationBrainSeed, getContextTemplate } from 'agent-workstation';

// 获取某角色的全部三层知识
const seeds = getBrainSeeds('frontend-developer');
// → { industry, job, workstation, contextTemplate }

// 单独获取行业级知识
const techSeed = getIndustryBrainSeed('tech');

// 获取企业上下文模板
const template = getContextTemplate();
```

---

## 📂 模板结构

每个完整模板包含五个文件：

```
roles/customer-service/customer-service-rep/
├── oad.yaml              # OAD 声明式配置（技能、渠道、指标）
├── system-prompt.md      # 50–80 行专业 system prompt
├── brain-seed.md         # 💼 岗位知识种子
├── workstation-seed.md   # 🔧 模板知识种子（SOP、场景、标准）
└── README.md             # 岗位说明书
```

### workstation-seed.md 结构

```markdown
# {角色}工位 — 模板知识库

## 典型工作场景 (3-5个)
## 标准操作流程 (SOP)
## 常见问题处理方案
## 质量标准/检查清单
## 新人上手指南
## 跨部门协作要点
```

---

## 📖 API Reference

```typescript
import {
  getCategories,            // () => { name, roles[] }[]
  getRole,                  // (category, role) => { category, role, files }
  searchRoles,              // (query) => { category, role, title, score }[]
  validateRole,             // (category, role) => { valid, errors[], warnings[] }
  getPopularRoles,          // () => top 20 curated roles
  getIndustries,            // () => industries/index.yaml content
  getIndustryBrainSeed,     // (category) => string | null
  getJobBrainSeed,          // (category, role) => string | null
  getWorkstationBrainSeed,  // (category, role) => string | null
  getContextTemplate,       // () => string
  getBrainSeeds,            // (role) => { industry, job, workstation, contextTemplate } | null
  WorkstationUI,            // Web UI server class
} from 'agent-workstation';
```

### searchRoles(query)

模糊搜索，支持多词匹配，按相关度排序：

```typescript
searchRoles('frontend');
// → [{ category: 'engineering', role: 'frontend-developer', score: 110 }]
```

### validateRole(category, role)

校验模板完整性：

```typescript
validateRole('sales', 'sales-development-rep');
// → { valid: true, errors: [], warnings: [] }
```

---

## 🔗 四件套生态

Agent Workstation 是跃盟 AI Agent 基础设施的一部分：

| 项目 | 定位 | 与 Agent Templates 的关系 |
|------|------|----------------------|
| **[opc-agent](https://github.com/Deepleaper/opc-agent)** | Agent Runtime | `opc init --role` 消费模板 |
| **[deepbrain](https://github.com/Deepleaper/deepbrain)** | Agent Memory（自进化 Agent 记忆） | brain-seed → `learn()` 注入初始记忆 |
| **[agentkits](https://github.com/Deepleaper/agentkits)** | Agent Model Layer | Mock 模式测试模板效果 |
| **agent-workstation** | Agent Templates | ← 你在这里 |

**🔄 自进化飞轮**：Templates 自带 Brain Seed → Model Layer 每次调用自动 learn → Runtime 持续运行 → Memory 自动 evolve → Agent 越来越强。

```
opc init --role customer-service-rep
    │
    ├──→ agent-workstation    提供 system-prompt + oad.yaml
    ├──→ deepbrain            brain-seed.md → learn() 初始化记忆
    └──→ agentkits            连接 LLM + 记忆，运行 Agent
```

---

## 📊 完成度仪表盘 / Progress Dashboard

### 总览 Overview

| 指标 | 数据 |
|------|------|
| 行业分类 (Industry) | 11 个 |
| 职能方向 (Function) | 19 个 |
| 角色总数 (Total Roles) | **100** |
| 生产就绪 (Production-Ready) | **20** (含 rich prompt + brain-seed + OAD) |
| 骨架模板 (Skeleton) | 80 (含 OAD，prompt 补全中) |
| Brain Seed 覆盖 | 14/20 生产就绪角色 (70%) |
| 行业级种子 (Industry Seeds) | 19 个行业 |

### 各职能完成度

| 职能 Function | 角色数 | 生产就绪 | 完成率 |
|---|:-:|:-:|:-:|
| 💻 Engineering | 10 | 1 (backend-developer) | 10% |
| 📦 Product | 6 | 1 (product-manager) | 17% |
| 📊 Data | 4 | 1 (data-analyst) | 25% |
| 🛒 Sales | 4 | 3 (SDR, account-exec, sales-analyst) | 75% |
| 📢 Marketing | 3 | 1 (content-marketer) | 33% |
| 💬 Customer Service | 5 | 3 (rep, complaint, live-chat) | 60% |
| 🎯 Customer Success | 5 | 0 | 0% |
| 📝 Content | 2 | 1 (copywriter) | 50% |
| 🎨 Design | 5 | 0 | 0% |
| 💰 Finance | 3 | 2 (financial-analyst, tax-preparer) | 67% |
| 👥 HR | 4 | 2 (recruiter, hr-coordinator) | 50% |
| ⚖️ Legal | 6 | 1 (corporate-lawyer) | 17% |
| ⚙️ Operations | 12 | 1 (operations-analyst) | 8% |
| 🔬 Research | 5 | 0 | 0% |
| 🎓 Education | 8 | 0 | 0% |
| 🏥 Healthcare | 7 | 0 | 0% |
| 👔 Executive | 5 | 0 | 0% |
| 🛡️ Admin | 3 | 0 | 0% |
| 💻 Tech | 3 | 0 | 0% |

### 最近更新 Recent Updates

| 日期 | 更新内容 |
|------|---------|
| 2026-04 | v2.1.0: 三层知识种子 (Industry/Job/Workstation) 架构完成 |
| 2026-04 | 新增 `WorkstationUI` Web 浏览器组件 |
| 2026-03 | 20 个角色补齐 brain-seed + workstation-seed |
| 2026-03 | `BrainSeedLoader` + `KnowledgeEvolver` API 上线 |
| 2026-02 | v1.5: 首批 20 个生产就绪角色完成 |
| 2026-01 | v1.0: 100 个骨架模板 + 19 职能分类 |

---

## 🗺️ Roadmap

| 阶段 | 目标 | 状态 |
|------|------|:----:|
| v1.0 | 100 骨架模板 | ✅ |
| v1.5 | 20 完整模板（含 prompt + brain-seed） | ✅ |
| v2.0 | 100 完整模板 | 🚧 |
| v3.0 | 849 岗位全覆盖 | 📋 |

## License

**双许可证 (Dual License)**：

| 许可证 | 适用场景 | 文件 |
|--------|---------|------|
| [LGPL-3.0](LICENSE) | 开源使用、二次开发（修改需开源） | `LICENSE` + `LICENSE-GPL3` |
| [Commercial](LICENSE-COMMERCIAL) | 闭源修改、专有产品嵌入、企业支持 | `LICENSE-COMMERCIAL` |

- ✅ 直接使用模板（不修改）：无需开源你的项目
- ✅ 修改模板内容：修改部分需以 LGPL-3.0 开源
- ✅ 创建全新模板：完全属于你
- 💼 需要闭源修改或专有分发？请联系 licensing@deepleaper.com

---

<a name="english"></a>

<div align="center">

# 👤 Agent Workstation

**Agent Templates — 100+ ready-to-use professional roles with built-in knowledge**

[![npm version](https://img.shields.io/badge/npm-v2.1.0-blue)](https://www.npmjs.com/package/agent-workstation)
[![License](https://img.shields.io/badge/License-LGPL_3.0-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-143_passing-brightgreen)]()

Not empty scaffolds. Every role ships with **Brain Seeds** — Agents don't start from zero, they're born with industry knowledge, then continue to self-evolve through learn → recall → evolve.<br/>
Agent Workstation is the **Agent Templates** layer in The Self-Evolving Agent Stack. Developer path: ① **Pick a template (Agent Templates)** → ② Connect models (Agent Model Layer) → ③ Run it (Agent Runtime) → ④ Auto-evolve (Agent Memory).<br/>
20 roles ship with expert system prompts + industry knowledge seeds + full OAD configs. The remaining 80 are in progress.

[Quick Start](#-quick-start) · [Roles](#-production-ready-roles-20) · [API](#-api-reference-1) · [中文版](#)

</div>

---

## ⚡ Quick Start

### With OPC Agent CLI

```bash
npm install -g opc-agent
opc init my-agent --role customer-service-rep
# → Generates: SOUL.md + agent.yaml + CONTEXT.md + brain-seed.md
```

### Programmatic Usage

```typescript
import { searchRoles, getPopularRoles, getCategories } from 'agent-workstation';

const roles = searchRoles('developer');
// → [{ category: 'engineering', role: 'backend-developer', score: 110 }, ...]

const popular = getPopularRoles(); // Top 20 curated roles
const categories = getCategories(); // All 19 function categories
```

---

## ✨ Key Features

| | Feature | Description |
|---|---|---|
| 👤 | **20 Production-Ready Roles** | Each with 50–80 line rich system prompts |
| 🧠 | **Brain Seed** | Industry knowledge seeds — no cold start |
| 🏭 | **3-Tier Taxonomy** | Industry → Function → Role, 19 functions |
| 🔍 | **Fuzzy Search** | `searchRoles('customer')` matches names & descriptions |
| ✅ | **Validation** | `validateRole()` checks completeness with errors/warnings |
| 🎨 | **Web UI** | Built-in role browser + template preview |
| 📦 | **OPC Agent Integration** | `opc init --role` generates a full agent workspace |

---

## 📋 Production-Ready Roles (20)

| Role | Function | Prompt Lines | Brain Seed |
|------|----------|:-----------:|:----------:|
| customer-service-rep | Customer Service | 71 | ✅ |
| complaint-handler | Customer Service | 71 | ✅ |
| live-chat-agent | Customer Service | 71 | ✅ |
| backend-developer | Engineering | 82 | ✅ |
| product-manager | Product | 79 | ✅ |
| content-marketer | Marketing | 78 | ✅ |
| corporate-lawyer | Legal | 77 | ✅ |
| financial-analyst | Finance | 73 | ✅ |
| data-analyst | Data | 71 | ✅ |
| operations-analyst | Operations | 71 | ✅ |
| sales-development-rep | Sales | 71 | ✅ |
| hr-coordinator | HR | 71 | — |
| tax-preparer | Finance | 71 | — |
| recruiter | HR | 69 | ✅ |
| onboarding-specialist | HR | 69 | — |
| copywriter | Content | 69 | ✅ |
| accounts-payable-clerk | Finance | 69 | — |
| social-media-manager | Marketing | 69 | — |
| account-executive | Sales | 69 | — |
| sales-analyst | Sales | 69 | — |

> Plus **80 skeleton templates** (OAD config included, prompts in progress) across all 19 functions.

---

## 🏗️ 3-Tier Taxonomy

```
Industry (11)  →  Function (19)  →  Role (100)

Technology     Engineering     backend-developer, frontend-developer, devops-engineer ...
               Product         product-manager, product-owner ...
               Data            data-analyst, data-engineer ...

E-commerce     Sales           sales-development-rep, account-executive ...
               Marketing       content-marketer, social-media-manager ...
               Customer Svc    customer-service-rep, complaint-handler ...

Finance        Finance         financial-analyst, tax-preparer ...
               Legal           corporate-lawyer, compliance-officer ...
```

---

## 📂 Template Structure

```
roles/customer-service/customer-service-rep/
├── oad.yaml          # Declarative config (skills, channels, metrics)
├── system-prompt.md  # 50–80 line expert system prompt
├── brain-seed.md     # 🧠 Industry knowledge seed (works with DeepBrain)
└── README.md         # Role description
```

---

## 📖 API Reference

```typescript
import {
  getCategories,     // () => { name, roles[] }[]
  getRole,           // (category, role) => { category, role, files }
  searchRoles,       // (query) => { category, role, title, score }[]
  validateRole,      // (category, role) => { valid, errors[], warnings[] }
  getPopularRoles,   // () => top 20 curated roles
  getIndustries,     // () => industries/index.yaml content
  getIndustryBrainSeed,     // (category) => string | null
  getJobBrainSeed,          // (category, role) => string | null
  getWorkstationBrainSeed,  // (category, role) => string | null
  getContextTemplate,       // () => string
  getBrainSeeds,            // (role) => { industry, job, workstation, contextTemplate } | null
  WorkstationUI,     // Web UI server class
} from 'agent-workstation';
```

---

## 🔗 Ecosystem

| Project | Purpose | Relationship |
|---------|---------|-------------|
| **[opc-agent](https://github.com/Deepleaper/opc-agent)** | Agent Runtime | `opc init --role` consumes templates |
| **[deepbrain](https://github.com/Deepleaper/deepbrain)** | Agent Memory (Self-Evolving) | brain-seed → `learn()` |
| **[agentkits](https://github.com/Deepleaper/agentkits)** | Agent Model Layer | Mock mode for testing |
| **agent-workstation** | Agent Templates | ← You are here |

**🔄 Self-Evolution Flywheel**: Templates ship with Brain Seeds → Model Layer auto-learns on every call → Runtime runs continuously → Memory auto-evolves → Agent gets stronger over time.

---

## 📊 Progress Dashboard

| Metric | Data |
|--------|------|
| Industries | 11 |
| Functions | 19 |
| Total Roles | **100** |
| Production-Ready | **20** (rich prompt + brain-seed + OAD) |
| Skeleton | 80 (OAD included, prompts in progress) |
| Brain Seed Coverage | 14/20 production roles (70%) |
| Industry Seeds | 19 industries |

### Recent Updates

| Date | Update |
|------|--------|
| 2026-04 | v2.1.0: 3-tier knowledge seed architecture complete |
| 2026-04 | Added `WorkstationUI` web browser component |
| 2026-03 | 20 roles completed with brain-seed + workstation-seed |
| 2026-03 | `BrainSeedLoader` + `KnowledgeEvolver` API launched |
| 2026-02 | v1.5: First 20 production-ready roles |
| 2026-01 | v1.0: 100 skeleton templates + 19 functions |

---

## 🗺️ Roadmap
|-------|------|:------:|
| v1.0 | 100 skeleton templates | ✅ |
| v1.5 | 20 complete templates (prompt + brain-seed) | ✅ |
| v2.0 | 100 complete templates | 🚧 |
| v3.0 | 849 roles full coverage | 📋 |

## License

**Dual License**:

| License | Use Case | File |
|---------|----------|------|
| [LGPL-3.0](LICENSE) | Open-source use, modifications must be open-sourced | `LICENSE` + `LICENSE-GPL3` |
| [Commercial](LICENSE-COMMERCIAL) | Closed-source modifications, proprietary embedding, enterprise support | `LICENSE-COMMERCIAL` |

- ✅ Use templates as-is (unmodified): no need to open-source your project
- ✅ Modify template content: modifications must be shared under LGPL-3.0
- ✅ Create brand-new templates: fully yours
- 💼 Need closed-source modifications or proprietary distribution? Contact licensing@deepleaper.com
