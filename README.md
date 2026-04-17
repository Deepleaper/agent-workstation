# 🏢 Agent Workstation — 虚拟工位模板库

**100+ AI 岗位模板，19 个职能分类，拿来就跑。**

> 不用从零写 Agent。选一个工位模板，5 分钟上岗。

## Quick Start

```bash
npm install agent-workstation

# 浏览所有模板
npx agent-workstation list

# 查看某个模板
npx agent-workstation show customer-service-rep

# 初始化（配合 opc-agent）
opc init my-agent --template customer-service-rep
```

## 19 个职能分类

| 分类 | 示例岗位 | 数量 |
|------|---------|------|
| 🛒 Sales | 销售代表、客户经理 | 6 |
| 💬 Customer Service | 客服专员、投诉处理 | 5 |
| 📊 Data | 数据分析师、BI 工程师 | 6 |
| 💰 Finance | 财务分析、审计 | 5 |
| 👥 HR | 招聘专员、HRBP | 6 |
| 📝 Content | 文案策划、编辑 | 5 |
| 🎨 Design | UI 设计师、品牌设计 | 5 |
| 💻 Engineering | 后端、前端、DevOps | 8 |
| 📦 Product | 产品经理、需求分析 | 5 |
| 📢 Marketing | 市场营销、增长 | 6 |
| ⚖️ Legal | 法务、合规 | 4 |
| 🏥 Healthcare | 医疗顾问 | 4 |
| 🎓 Education | 培训师、教学设计 | 5 |
| 🔬 Research | 研究员、行业分析 | 5 |
| ⚙️ Operations | 运营分析、流程优化 | 6 |
| 👔 Executive | CEO助理、战略分析 | 4 |
| 🛡️ Admin | 行政管理 | 4 |
| 🎯 Customer Success | 客户成功经理 | 4 |
| 💻 Tech | 技术支持、IT运维 | 5 |

## 三层分类体系

```
行业 (10+)  →  职能 (19)  →  工位 (100+)
Technology     Engineering     Backend Developer
               Product        Product Manager
E-commerce     Sales          Sales Dev Rep
               Marketing      Growth Hacker
```

详见 `industries/index.yaml`。

## L1 Brain Seed

每个完整模板包含 `brain-seed.md`，为 Agent 提供初始记忆：

```
roles/sales/sales-development-rep/
├── oad.yaml          # Agent 配置
├── system-prompt.md  # 系统提示词
├── brain-seed.md     # 🧠 L1 初始记忆
└── README.md         # 岗位说明
```

## 模板结构

每个模板包含：

```
roles/sales/sales-development-rep/
├── oad.yaml          # Agent 配置（OAD 格式）
├── system-prompt.md  # 系统提示词
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
```

## 目标：849 个岗位

当前：100 个模板（16 个完整版）
目标：覆盖现代企业所有职能的 849 个岗位

## License

Apache-2.0

## Links

- [deepbrain](https://github.com/Deepleaper/deepbrain) — Agent 记忆引擎
- [opc-agent](https://github.com/Deepleaper/opc-agent) — Agent OS
- [agentkits](https://github.com/Deepleaper/agentkits) — 带记忆的 OpenRouter
