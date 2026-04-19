# Workstation Hub API

Template marketplace API for AI agent workstation roles.

## Quick Start

```bash
cd hub
npm install
npx ts-node src/indexer.ts   # Build template index
npx ts-node src/index.ts     # Start server on :4100
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/templates` | List templates (supports `?q=`, `?category=`, `?limit=`, `?offset=`) |
| GET | `/api/templates/:category/:role` | Get template detail + brain-seed content |
| GET | `/api/stats` | Template statistics |

## Architecture

- `src/indexer.ts` — Scans `roles/*/oad.yaml`, generates `templates.json`
- `src/index.ts` — HTTP server (port 4100, CORS enabled)
- `src/router.ts` — Lightweight URL router
- `src/handlers/` — Request handlers
