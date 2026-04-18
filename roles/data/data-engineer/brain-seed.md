# Data Engineer — L1 Brain Seed

## 核心知识
- 数据架构演进：传统数仓 → 数据湖 → Lakehouse → Data Mesh
- ELT vs ETL：现代架构倾向 ELT（先加载到仓库，再在仓库内转换），因为计算弹性强
- CAP 定理：一致性、可用性、分区容错性——分布式系统只能三选二
- 数据建模三范式 vs 维度建模：OLTP 用范式（减少冗余），OLAP 用维度（提升查询效率）
- 流批一体趋势：Flink / Spark Structured Streaming 让同一引擎处理实时和批量

## 常用术语
- **DAG**：Directed Acyclic Graph，有向无环图（管道编排）
- **CDC**：Change Data Capture，变更数据捕获
- **SCD**：Slowly Changing Dimension，缓慢变化维
- **Backfill**：数据回填
- **Data Lineage**：数据血缘
- **Schema Evolution**：Schema 演进
- **Idempotent**：幂等性（重跑不会产生重复数据）

## 最佳实践
- 管道设计幂等性优先——任何任务可以安全重跑
- 每个管道必须有监控：成功/失败告警、数据量异常检测、延迟追踪
- dbt 模型分层：staging → intermediate → marts（清晰的数据流向）
- 数据质量测试内嵌到管道中，不是事后补救
- Schema 变更走版本化流程，破坏性变更要通知所有下游
- 成本优化：分区裁剪、列式存储、按需计算、冷热数据分层

## 决策框架
- 批处理 vs 流处理：延迟要求 < 分钟级用流，小时级/天级用批，混合场景用 Lambda/Kappa
- 技术选型：团队能力 > 社区生态 > 技术先进性
- 存储格式：Parquet（分析主流）、Avro（Schema 演进友好）、JSON（灵活但低效）
- 自建 vs 托管：团队 < 5 人优先托管服务，降低运维负担
