const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { getCategories, getRole, searchRoles, getPopularRoles, ROLES_DIR } = require('../../index.js');
const { WorkstationHub } = require('../hub/index.js');

class WorkstationUI {
  constructor(config = {}) {
    this.port = config.port || 4003;
    this.staticDir = config.staticDir || path.join(__dirname);
    this.hubStaticDir = path.join(__dirname, '..', 'hub-ui');
    this.server = null;
    this.hub = new WorkstationHub();
  }

  async start() {
    this.server = http.createServer((req, res) => this._handle(req, res));
    return new Promise((resolve) => {
      this.server.listen(this.port, () => resolve());
    });
  }

  async stop() {
    if (!this.server) return;
    return new Promise((resolve) => {
      this.server.close(() => resolve());
    });
  }

  _cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  _json(res, data, status = 200) {
    this._cors(res);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  _handle(req, res) {
    const url = new URL(req.url, `http://localhost:${this.port}`);
    const p = url.pathname;

    if (req.method === 'OPTIONS') {
      this._cors(res);
      res.writeHead(204);
      return res.end();
    }

    // Hub API routes
    if (p === '/api/hub/search') return this._hubSearch(res, url);
    if (p === '/api/hub/industries') return this._json(res, this.hub.listIndustries());
    if (p === '/api/hub/popular') return this._json(res, this.hub.getPopular(parseInt(url.searchParams.get('limit')) || 20));
    const hubRoleMatch = p.match(/^\/api\/hub\/roles\/([^/]+)$/);
    if (hubRoleMatch && req.method === 'GET') return this._hubRoleDetail(res, decodeURIComponent(hubRoleMatch[1]));
    if (hubRoleMatch && req.method === 'POST') {
      if (p.endsWith('/rate')) return this._hubRate(req, res, decodeURIComponent(hubRoleMatch[1]));
      if (p.endsWith('/export')) return this._hubExport(req, res, decodeURIComponent(hubRoleMatch[1]));
    }
    const hubRateMatch = p.match(/^\/api\/hub\/roles\/([^/]+)\/rate$/);
    if (hubRateMatch && req.method === 'POST') return this._hubRate(req, res, decodeURIComponent(hubRateMatch[1]));
    const hubExportMatch = p.match(/^\/api\/hub\/roles\/([^/]+)\/export$/);
    if (hubExportMatch && req.method === 'POST') return this._hubExport(req, res, decodeURIComponent(hubExportMatch[1]));

    // Serve hub UI
    if (p === '/hub' || p === '/hub/') {
      const htmlPath = path.join(this.hubStaticDir, 'index.html');
      if (fs.existsSync(htmlPath)) {
        this._cors(res);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
    }

    // API routes
    if (p === '/api/stats') return this._stats(res);
    if (p === '/api/roles/search') return this._search(res, url.searchParams.get('q') || '');
    if (p === '/api/roles/popular') return this._popular(res);
    if (p === '/api/roles' && !p.includes('/api/roles/')) return this._allRoles(res);
    if (p === '/api/categories') return this._categories(res);

    // /api/categories/:id/roles
    const catRolesMatch = p.match(/^\/api\/categories\/([^/]+)\/roles$/);
    if (catRolesMatch) return this._categoryRoles(res, decodeURIComponent(catRolesMatch[1]));

    // /api/roles/:category/:role
    const roleMatch = p.match(/^\/api\/roles\/([^/]+)\/([^/]+)$/);
    if (roleMatch) return this._roleDetail(res, decodeURIComponent(roleMatch[1]), decodeURIComponent(roleMatch[2]));

    // Serve index.html for everything else
    if (p === '/' || !p.startsWith('/api/')) {
      const htmlPath = path.join(this.staticDir, 'index.html');
      if (fs.existsSync(htmlPath)) {
        this._cors(res);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
    }

    this._json(res, { error: 'Not found' }, 404);
  }

  _stats(res) {
    const cats = getCategories();
    let totalRoles = 0;
    const industries = new Set();
    for (const c of cats) {
      totalRoles += c.roles.length;
      industries.add(c.name);
    }
    this._json(res, { totalRoles, categories: cats.length, industries: industries.size });
  }

  _allRoles(res) {
    const cats = getCategories();
    const roles = [];
    for (const c of cats) {
      for (const r of c.roles) {
        roles.push({ category: c.name, role: r });
      }
    }
    this._json(res, roles);
  }

  _search(res, q) {
    this._json(res, searchRoles(q));
  }

  _popular(res) {
    this._json(res, getPopularRoles());
  }

  _categories(res) {
    this._json(res, getCategories());
  }

  _categoryRoles(res, categoryId) {
    const cats = getCategories();
    const cat = cats.find(c => c.name === categoryId);
    if (!cat) return this._json(res, { error: 'Category not found' }, 404);
    this._json(res, cat.roles.map(r => ({ category: cat.name, role: r })));
  }

  _hubSearch(res, url) {
    const q = url.searchParams.get('q') || '';
    const filters = {};
    if (url.searchParams.get('industry')) filters.industry = url.searchParams.get('industry');
    if (url.searchParams.get('function')) filters.function = url.searchParams.get('function');
    this._json(res, this.hub.search(q, filters));
  }

  _hubRoleDetail(res, roleId) {
    const details = this.hub.getRoleDetails(roleId);
    if (!details) return this._json(res, { error: 'Role not found' }, 404);
    this._json(res, details);
  }

  _hubRate(req, res, roleId) {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { rating, comment } = JSON.parse(body);
        this.hub.rate(roleId, rating, comment);
        this._json(res, { ok: true });
      } catch (e) {
        this._json(res, { error: e.message }, 400);
      }
    });
  }

  _hubExport(req, res, roleId) {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { outputDir } = JSON.parse(body || '{}');
        const dir = await this.hub.exportRole(roleId, outputDir || require('node:os').tmpdir());
        this._json(res, { ok: true, path: dir });
      } catch (e) {
        this._json(res, { error: e.message }, 400);
      }
    });
  }

  _roleDetail(res, category, role) {
    const data = getRole(category, role);
    if (!data) return this._json(res, { error: 'Role not found' }, 404);
    // Extract key files
    const systemPrompt = data.files['system-prompt.md'] || data.files['prompts/system.md'] || '';
    const brainSeed = data.files['brain-seed.md'] || '';
    const readme = data.files['README.md'] || data.files['readme.md'] || '';
    // Parse oad.yaml for metadata
    const oad = data.files['oad.yaml'] || '';
    let title = role.replace(/-/g, ' ');
    let description = '';
    const titleMatch = oad.match(/en:\s*"?([^"\n]+)"?/);
    if (titleMatch) title = titleMatch[1];
    const descMatch = oad.match(/description:\s*\n\s*en:\s*"?([^"\n]+)"?/);
    if (descMatch) description = descMatch[1];

    this._json(res, { category, role, title, description, systemPrompt, brainSeed, readme, files: Object.keys(data.files) });
  }
}

module.exports = { WorkstationUI };
