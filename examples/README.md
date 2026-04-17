# Agent Workstation Examples

## Run Examples

```bash
# Browse all industries and role templates
npx tsx examples/list-templates.ts

# Load a specific role template
npx tsx examples/create-workspace.ts sales/account-executive
npx tsx examples/create-workspace.ts engineering/backend-developer
```

## What Each Example Shows

| Example | Concepts |
|---------|----------|
| `list-templates.ts` | Browse industries, categories, role counts |
| `create-workspace.ts` | Load OAD config, system prompt, skill prompts |

## Note

These examples read the template files directly. Install `yaml` for industry parsing:

```bash
npm install yaml
```
