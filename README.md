# 🏢 Agent Workstation

**AI Agent Templates for Business Roles**

A growing library of ready-to-use agent role templates for real business positions. Our target: **849 roles** covering every function in a modern enterprise. Currently shipping the first batch of 20 fully-defined templates.

## What's Inside

Each role template includes:
- **oad.yaml** — OPC Agent Definition (skills, metrics, triggers)
- **prompts/system.md** — Detailed bilingual system prompt (EN/ZH)
- **README.md** — Role overview, use cases, example interactions

## Quick Start

```bash
# Browse roles
ls roles/

# Use a template with OPC Agent
cp roles/sales/account-executive/oad.yaml ~/.opc-agent/agents/my-ae/
```

## Structure

```
roles/
├── customer-service/
├── sales/
├── marketing/
├── finance/
├── hr/
├── tech/
├── data/
└── content/
```

## Progress

| Batch | Roles | Status |
|-------|-------|--------|
| 1 | 20 | ✅ Shipped |
| 2-N | 829 | 🔜 Coming |

## Related Projects

- [opc-agent](https://github.com/anthropics/opc-agent) — OPC Agent runtime
- [deepbrain](https://github.com/Deepleaper/deepbrain) — Shared knowledge brain
- [agentkits](https://github.com/Deepleaper/agentkits) — Agent skill toolkits

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add a role template.

## License

See [LICENSE](./LICENSE).
