# 🏢 Agent Workstation

**AI Agent 业务角色模板库**

一个持续增长的 AI Agent 角色模板库，覆盖真实企业岗位。目标：**849 个角色**，覆盖现代企业的每一个职能。当前已发布第一批 20 个完整模板。

## 包含内容

每个角色模板包括：
- **oad.yaml** — OPC Agent 配置（技能、指标、触发器）
- **prompts/system.md** — 详细的中英双语系统提示词（200+ 词）
- **README.md** — 角色概述、使用场景、示例交互

## 快速开始

```bash
# 浏览角色
ls roles/

# 将模板用于 OPC Agent
cp roles/sales/account-executive/oad.yaml ~/.opc-agent/agents/my-ae/
```

## 目录结构

```
roles/
├── customer-service/   # 客服
├── sales/              # 销售
├── marketing/          # 市场营销
├── finance/            # 财务
├── hr/                 # 人力资源
├── tech/               # 技术
├── data/               # 数据
└── content/            # 内容
```

## 进度

| 批次 | 角色数 | 状态 |
|------|--------|------|
| 第1批 | 20 | ✅ 已发布 |
| 第2-N批 | 829 | 🔜 即将推出 |

## 相关项目

- [opc-agent](https://github.com/anthropics/opc-agent) — OPC Agent 运行时
- [deepbrain](https://github.com/Deepleaper/deepbrain) — 共享知识大脑
- [agentkits](https://github.com/Deepleaper/agentkits) — Agent 技能工具包

## 贡献

参见 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何贡献角色模板。

## 许可证

参见 [LICENSE](./LICENSE)。
