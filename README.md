<div align="center">

# 🏢 Agent Workstation

**虚拟工位模板库 — 100+ AI 岗位，拿来就跑**

[![npm](https://img.shields.io/npm/v/agent-workstation)](https://www.npmjs.com/package/agent-workstation)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Templates](https://img.shields.io/badge/Templates-100+-green)]()

[快速开始](#快速开始) · [岗位分类](#三层分类体系) · [模板结构](#模板结构) · [English](#english)

</div>

---

## 💡 一句话介绍

> **不用从零写 Agent。选一个工位，5 分钟上岗。**

Agent Workstation 提供 100+ 开箱即用的 AI 岗位模板，覆盖 19 个职能方向。每个模板包含系统提示词、渠道配置、评分标准，以及 L1 初始记忆。

## 快速开始

```bash
npm install agent-workstation

# 浏览所有模板
npx agent-workstation list

# 查看某个模板
npx agent-workstation show customer-service-rep

# 配合 opc-agent 使用
opc init my-agent --template customer-service-rep
```

## 三层分类体系

```
行业 (11)  →  职能 (19)  →  工位 (100+)

Technology     Engineering     Backend Developer
               Product        Product Manager
               Data           Data Analyst

E-commerce     Sales          Sales Dev Rep
               Marketing      Growth Hacker
               Customer Svc   Customer Service Rep

Finance        Finance        Financial Analyst
               Legal          Legal Counsel
               Operations     Operations Analyst
```

### 11 个行业

| 行业 | 英文 | 核心职能 |
|------|------|---------|
| 🖥️ 科技与软件 | Technology | Engineering, Product, Data |
| 🛒 电商与零售 | E-commerce | Sales, Marketing, Customer Service |
| 🏦 金融服务 | Finance | Finance, Legal, Operations |
| 🏥 医疗健康 | Healthcare | Healthcare, Research |
| 🎓 教育培训 | Education | Education, Content |
| 🏭 制造业 | Manufacturing | Engineering, Operations |
| 📋 咨询服务 | Consulting | Research, Sales |
| 🎬 媒体娱乐 | Media | Content, Marketing, Design |
| 🏠 房地产 | Real Estate | Sales, Finance, Legal |
| 🚚 物流供应链 | Logistics | Operations, Sales |
| 🏢 通用企业 | General | Executive, Admin, HR |

### 19 个职能

| 分类 | 示例岗位 | 模板数 |
|------|---------|--------|
| 💻 Engineering | 后端、前端、DevOps | 8 |
| 📦 Product | 产品经理、需求分析 | 5 |
| 📊 Data | 数据分析师、BI | 6 |
| 🛒 Sales | 销售代表、客户经理 | 6 |
| 📢 Marketing | 市场营销、增长黑客 | 6 |
| 💬 Customer Service | 客服专员、投诉处理 | 5 |
| 📝 Content | 文案策划、编辑 | 5 |
| 🎨 Design | UI设计、品牌设计 | 5 |
| 💰 Finance | 财务分析、审计 | 5 |
| 👥 HR | 招聘、HRBP | 6 |
| ⚖️ Legal | 法务、合规 | 4 |
| ⚙️ Operations | 运营分析、流程优化 | 6 |
| 🔬 Research | 研究员、行业分析 | 5 |
| 🎓 Education | 培训师、教学设计 | 5 |
| 🏥 Healthcare | 医疗顾问 | 4 |
| 👔 Executive | CEO助理、战略分析 | 4 |
| 🛡️ Admin | 行政管理 | 4 |
| 🎯 Customer Success | 客户成功经理 | 4 |
| 💻 Tech | 技术支持、IT运维 | 5 |

## 模板结构

每个完整模板包含：

```
roles/sales/sales-development-rep/
├── oad.yaml          # Agent 配置（OAD 声明式）
├── system-prompt.md  # 系统提示词
├── brain-seed.md     # 🧠 L1 初始记忆
└── README.md         # 岗位说明
```

### oad.yaml 示例

```yaml
id: sales-development-rep
name: Sales Development Rep
name_zh: 销售开发代表
category: sales
version: "2.0.0"

skills:
  - lead-qualification
  - cold-outreach
  - crm-management

channels:
  - type: web-app
    priority: primary
  - type: email
    priority: secondary

resources:
  data:
    - crm-database
    - lead-scoring-model
  tools:
    - email-sequencer
    - calendar-booking

metrics:
  - qualified-leads-per-week
  - response-time
  - conversion-rate
```

### brain-seed.md — L1 初始记忆

每个模板的 `brain-seed.md` 为 Agent 提供开箱即用的初始知识：

- **核心领域知识** — 这个岗位必须知道的
- **常见场景** — 典型问题和处理方式
- **学习优先级** — Agent 应该重点关注什么
- **检索提示** — 什么关键词应触发记忆检索

配合 [DeepBrain](https://github.com/Deepleaper/deepbrain) 使用，Agent 从第一天就有基础记忆，不用从零开始。

## 目标

| 阶段 | 目标 | 状态 |
|------|------|------|
| v1.0 | 100 骨架模板 | ✅ |
| v1.5 | 16 完整模板 | ✅ |
| v2.0 | 100 完整模板（含 brain-seed） | 🚧 |
| v3.0 | 849 岗位全覆盖 | 📋 |

## 🔗 生态

| 项目 | 定位 | 关系 |
|------|------|------|
| [deepbrain](https://github.com/Deepleaper/deepbrain) | Agent 记忆引擎 | brain-seed → learn() |
| [opc-agent](https://github.com/Deepleaper/opc-agent) | Agent OS | `opc init --template` |
| [agentkits](https://github.com/Deepleaper/agentkits) | 带记忆的 OpenRouter | Mock 模式测试模板 |
| **agent-workstation** | 虚拟工位模板 | ← 你在这里 |

## License

Apache-2.0

---

<a name="english"></a>

## English

## 💡 What Is Agent Workstation?

> **Don't build Agents from scratch. Pick a role, onboard in 5 minutes.**

Agent Workstation provides 100+ ready-to-use AI role templates covering 19 business functions. Each template includes a system prompt, channel configuration, scoring criteria, and L1 initial memory.

## Quick Start

```bash
npm install agent-workstation

# Browse all templates
npx agent-workstation list

# View a specific template
npx agent-workstation show customer-service-rep

# Use with opc-agent
opc init my-agent --template customer-service-rep
```

## 3-Tier Taxonomy

```
Industry (11)  →  Function (19)  →  Role (100+)

Technology     Engineering     Backend Developer
               Product        Product Manager
               Data           Data Analyst

E-commerce     Sales          Sales Dev Rep
               Marketing      Growth Hacker
               Customer Svc   Customer Service Rep

Finance        Finance        Financial Analyst
               Legal          Legal Counsel
               Operations     Operations Analyst
```

### 11 Industries

| Industry | Core Functions |
|----------|---------------|
| 🖥️ Technology & Software | Engineering, Product, Data |
| 🛒 E-commerce & Retail | Sales, Marketing, Customer Service |
| 🏦 Financial Services | Finance, Legal, Operations |
| 🏥 Healthcare | Healthcare, Research |
| 🎓 Education & Training | Education, Content |
| 🏭 Manufacturing | Engineering, Operations |
| 📋 Consulting | Research, Sales |
| 🎬 Media & Entertainment | Content, Marketing, Design |
| 🏠 Real Estate | Sales, Finance, Legal |
| 🚚 Logistics & Supply Chain | Operations, Sales |
| 🏢 General Enterprise | Executive, Admin, HR |

### 19 Functions

| Function | Example Roles | Templates |
|----------|--------------|-----------|
| 💻 Engineering | Backend, Frontend, DevOps | 8 |
| 📦 Product | Product Manager, Requirements Analyst | 5 |
| 📊 Data | Data Analyst, BI | 6 |
| 🛒 Sales | Sales Rep, Account Manager | 6 |
| 📢 Marketing | Marketing, Growth Hacker | 6 |
| 💬 Customer Service | Service Rep, Complaints Handler | 5 |
| 📝 Content | Copywriter, Editor | 5 |
| 🎨 Design | UI Design, Brand Design | 5 |
| 💰 Finance | Financial Analyst, Auditor | 5 |
| 👥 HR | Recruiter, HRBP | 6 |
| ⚖️ Legal | Legal Counsel, Compliance | 4 |
| ⚙️ Operations | Operations Analyst, Process Optimization | 6 |
| 🔬 Research | Researcher, Industry Analyst | 5 |
| 🎓 Education | Trainer, Instructional Designer | 5 |
| 🏥 Healthcare | Medical Consultant | 4 |
| 👔 Executive | CEO Assistant, Strategy Analyst | 4 |
| 🛡️ Admin | Administrative Management | 4 |
| 🎯 Customer Success | Customer Success Manager | 4 |
| 💻 Tech | Tech Support, IT Operations | 5 |

## Template Structure

Each complete template contains:

```
roles/sales/sales-development-rep/
├── oad.yaml          # Agent config (OAD declarative)
├── system-prompt.md  # System prompt
├── brain-seed.md     # 🧠 L1 initial memory
└── README.md         # Role description
```

### oad.yaml Example

```yaml
id: sales-development-rep
name: Sales Development Rep
name_zh: 销售开发代表
category: sales
version: "2.0.0"

skills:
  - lead-qualification
  - cold-outreach
  - crm-management

channels:
  - type: web-app
    priority: primary
  - type: email
    priority: secondary

resources:
  data:
    - crm-database
    - lead-scoring-model
  tools:
    - email-sequencer
    - calendar-booking

metrics:
  - qualified-leads-per-week
  - response-time
  - conversion-rate
```

### brain-seed.md — L1 Initial Memory

Each template's `brain-seed.md` provides the Agent with ready-to-use initial knowledge:

- **Core domain knowledge** — What this role must know
- **Common scenarios** — Typical problems and how to handle them
- **Learning priorities** — What the Agent should focus on
- **Retrieval hints** — Keywords that should trigger memory recall

Works with [DeepBrain](https://github.com/Deepleaper/deepbrain) so the Agent has baseline memory from day one — no cold start.

## Roadmap

| Phase | Goal | Status |
|-------|------|--------|
| v1.0 | 100 skeleton templates | ✅ |
| v1.5 | 16 complete templates | ✅ |
| v2.0 | 100 complete templates (with brain-seed) | 🚧 |
| v3.0 | 849 roles full coverage | 📋 |

## 🔗 Ecosystem

| Project | Role | Relationship |
|---------|------|-------------|
| [deepbrain](https://github.com/Deepleaper/deepbrain) | Agent Memory Engine | brain-seed → learn() |
| [opc-agent](https://github.com/Deepleaper/opc-agent) | Agent OS | `opc init --template` |
| [agentkits](https://github.com/Deepleaper/agentkits) | OpenRouter with Memory | Mock mode for template testing |
| **agent-workstation** | Virtual Role Templates | ← You are here |

## License

Apache-2.0
