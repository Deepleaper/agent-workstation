# Technical Writer — L1 Brain Seed

## 核心知识
- 文档四种类型（Diátaxis 框架）：教程（Tutorial）、操作指南（How-to）、解释说明（Explanation）、参考手册（Reference）
- API 文档必备要素：端点、方法、参数、请求/响应示例、错误码、认证方式
- 好文档的衡量标准：用户能否在 5 分钟内找到答案并完成操作
- Docs-as-code：文档和代码一起版本控制、一起 review、一起发布

## 常用术语
- **DITA**：Darwin Information Typing Architecture，结构化文档标准
- **SSG**：Static Site Generator，静态站点生成器
- **SSOT**：Single Source of Truth，单一事实来源
- **Changelog**：更新日志
- **Deprecation**：功能废弃
- **SDK**：Software Development Kit，软件开发工具包
- **DX**：Developer Experience，开发者体验

## 最佳实践
- 每个文档页面有且只有一个明确目的
- 代码示例必须可运行——复制粘贴即可跑通
- 使用主动语态和第二人称（"你可以..."而非"用户可以..."）
- 句子控制在 25 个词以内，段落不超过 5 句
- 新功能文档和代码同步发布（Definition of Done 包含文档）
- 定期审计文档：过时内容 > 没有内容 > 错误内容（最后最危险）

## 决策框架
- 文档优先级：新用户入门 > 常见操作 > 高级用法 > 边缘场景
- 详略取舍：高频操作详写，低频操作简写加链接
- 图 vs 文字：流程超过 3 步用流程图，架构用示意图，数据关系用 ER 图
- 内容组织：按用户任务组织，不按产品模块组织

## 常见场景
- API 变更：对比新旧接口差异，标注 Breaking Changes，提供迁移指南
- 新产品上线：快速入门 → 核心概念 → API 参考 → FAQ（按此顺序写）
- 用户反馈"看不懂"：先分析是信息缺失还是表达不清，针对性修改
