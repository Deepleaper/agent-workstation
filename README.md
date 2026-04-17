# 🏢 AI 岗位模板库 | Agent Workstation

**100 个 AI 岗位模板，覆盖 19 个行业分类，开箱即用。**

目标：**849 个岗位**，覆盖现代企业所有职能。当前已有 **100 个骨架模板**，其中 **8 个已完整升级**（系统提示词 + 渠道配置 + DTV 配置）。

## 📂 分类总览

| 分类 | 英文标识 | 岗位数 | 说明 |
|------|---------|--------|------|
| 行政管理 | `admin` | 3 | 行政助理、办公室管理、差旅协调 |
| 内容创作 | `content` | 2 | 文案、技术写作 |
| 客户服务 | `customer-service` | 5 | 客服代表、投诉处理、VIP 客户管理 |
| 客户成功 | `customer-success` | 5 | 客户成功经理、续约、社区管理 |
| 数据分析 | `data` | 4 | 数据分析师、BI 分析师、数据工程师 |
| 设计 | `design` | 5 | UI 设计、品牌设计、动效设计 |
| 教育培训 | `education` | 8 | 企业培训、课程设计、在线辅导 |
| 工程技术 | `engineering` | 10 | 前后端开发、DevOps、ML 工程师 |
| 高管 | `executive` | 5 | 首席幕僚、战略总监、变革负责人 |
| 财务 | `finance` | 3 | 财务分析师、应付账款、税务 |
| 医疗健康 | `healthcare` | 7 | 临床数据分析、健康顾问、远程医疗 |
| 人力资源 | `hr` | 4 | 招聘、入职、人事协调 |
| 法务 | `legal` | 6 | 合规、合同审查、知识产权、隐私 |
| 市场营销 | `marketing` | 3 | 内容营销、SEO、社交媒体 |
| 运营管理 | `operations` | 12 | 供应链、库存、采购、质检 |
| 产品 | `product` | 6 | 产品经理、产品分析、UX 研究 |
| 研究 | `research` | 5 | 竞品情报、趋势分析、技术侦察 |
| 销售 | `sales` | 4 | 客户经理、销售分析、SDR |
| 技术 | `tech` | 3 | 代码审查、DevOps、安全工程 |

## 🚀 快速开始

### 1. 选择模板

浏览 `roles/` 目录，按分类找到适合的岗位：

```bash
ls roles/                    # 查看所有分类
ls roles/sales/              # 查看销售类岗位
cat roles/sales/account-executive/README.md  # 查看岗位说明
```

### 2. 定制模板

复制模板到你的工作目录，修改 `oad.yaml` 和 `prompts/system.md`：

```bash
cp -r roles/sales/account-executive/ ~/.opc-agent/agents/my-ae/
# 编辑 oad.yaml 调整技能、指标、触发条件
# 编辑 prompts/system.md 调整系统提示词
```

### 3. 部署到 OPC Agent

```bash
# 直接用 OPC Agent 加载
opc-agent load ~/.opc-agent/agents/my-ae/oad.yaml
```

## 📊 进度

| 批次 | 岗位数 | 状态 |
|------|--------|------|
| 第 1 批 | 100 个骨架模板 | ✅ 已交付 |
| 第 2 批 | 8 个完整模板 | ✅ 已升级（客服代表、招聘专员、SDR、财务分析师、人事协调、数据分析师、运营分析师、文案） |
| 第 3 批 | 8 个完整模板 | ✅ 已升级（投诉处理、在线客服、客户经理、销售分析师、应付账款、税务专员、入职引导、社媒运营） |
| 第 4-N 批 | 741 个待开发 | 🔜 进行中 |

---

# 🏢 Agent Workstation (English)

**100 AI Agent Templates across 19 business categories, ready to use.**

Target: **849 roles** covering every function in a modern enterprise. Currently **100 skeleton templates** with **16 fully upgraded** (system prompt + channels + DTV config).

## Quick Start

```bash
# Browse roles
ls roles/

# Copy a template
cp -r roles/sales/account-executive/ ~/.opc-agent/agents/my-ae/

# Load with OPC Agent
opc-agent load ~/.opc-agent/agents/my-ae/oad.yaml
```

## Categories

admin · content · customer-service · customer-success · data · design · education · engineering · executive · finance · healthcare · hr · legal · marketing · operations · product · research · sales · tech

## Related Projects

- [opc-agent](https://github.com/anthropics/opc-agent) — OPC Agent runtime
- [deepbrain](https://github.com/Deepleaper/deepbrain) — Shared knowledge brain
- [agentkits](https://github.com/Deepleaper/agentkits) — Agent skill toolkits

## License

MIT
