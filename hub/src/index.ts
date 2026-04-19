import * as http from 'http';
import { Router } from './router';
import { handleTemplates } from './handlers/templates';
import { handleTemplate } from './handlers/template';
import { handleStats } from './handlers/stats';

const PORT = 4100;
const router = new Router();

router.get('/api/templates', handleTemplates);
router.get('/api/templates/:category/:role', handleTemplate);
router.get('/api/stats', handleStats);

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (!router.handle(req, res)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Workstation Hub API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET /api/templates?q=&category=&limit=20&offset=0');
  console.log('  GET /api/templates/:category/:role');
  console.log('  GET /api/stats');
});
