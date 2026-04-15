# Contributing to Agent Workstation

Thanks for helping grow our role template library! Here's how to contribute.

## Adding a New Role

1. **Pick a role** not yet in `matrix.json`
2. **Create the directory**: `roles/{category}/{role-id}/`
3. **Create three files**:

### oad.yaml
```yaml
id: your-role-id
name: Role Name
name_zh: 中文名
category: category-name
skills: [skill-1, skill-2, skill-3]
metrics: [metric-1, metric-2]
```

### prompts/system.md
- Bilingual (English + Chinese)
- 200+ words minimum
- Include: role definition, core responsibilities, communication style, constraints

### README.md
- Role description
- Use cases (3-5)
- Example interactions

4. **Update `matrix.json`** to include your role
5. **Open a PR** with title: `feat: add {role-id} template`

## Guidelines

- One role per PR (unless adding a full category)
- System prompts must be bilingual (EN/ZH)
- Keep oad.yaml skills realistic (3-5 per role)
- Test your system prompt before submitting

## Quality Checklist

- [ ] oad.yaml is valid YAML
- [ ] system.md is 200+ words
- [ ] README.md has use cases
- [ ] matrix.json updated
- [ ] No placeholder text
