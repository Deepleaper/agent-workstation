const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { getCategories, getRole, searchRoles, getPopularRoles, ROLES_DIR,
        getIndustryBrainSeed, getJobBrainSeed, getWorkstationBrainSeed } = require('../../index.js');
const { WorkstationHub } = require('../hub/index.js');

const CUSTOM_ROLES_DIR = path.join(__dirname, '..', '..', '.custom-roles');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  _json(res, data, status = 200) {
    this._cors(res);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  _readBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve({}); }
      });
    });
  }

  _handle(req, res) {
    const url = new URL(req.url, `http://localhost:${this.port}`);
    const p = url.pathname;

    if (req.method === 'OPTIONS') {
      this._cors(res);
      res.writeHead(204);
      return res.end();
    }

    // ---- New Template/Market APIs ----
    if (p === '/api/stats') return this._stats(res);
    if (p === '/api/templates' && req.method === 'GET') return this._templates(res, url);
    if (p === '/api/industries' && !p.includes('/api/industries/')) return this._industries(res);
    if (p === '/api/brain-seeds' && !p.includes('/api/brain-seeds/')) return this._brainSeeds(res, url);

    const templateMatch = p.match(/^\/api\/templates\/([^/]+)\/([^/]+)$/);
    if (templateMatch && req.method === 'GET') return this._templateDetail(res, decodeURIComponent(templateMatch[1]), decodeURIComponent(templateMatch[2]));

    const industryMatch = p.match(/^\/api\/industries\/([^/]+)$/);
    if (industryMatch && req.method === 'GET') return this._industryDetail(res, decodeURIComponent(industryMatch[1]));

    const brainSeedMatch = p.match(/^\/api\/brain-seeds\/([^/]+)\/([^/]+)$/);
    if (brainSeedMatch && req.method === 'GET') return this._brainSeedDetail(res, decodeURIComponent(brainSeedMatch[1]), decodeURIComponent(brainSeedMatch[2]));

    // ---- Custom Roles CRUD ----
    if (p === '/api/roles' && req.method === 'POST') return this._createRole(req, res);
    if (p === '/api/roles' && req.method === 'GET') return this._customRoles(res);
    const roleEditMatch = p.match(/^\/api\/roles\/([^/]+)$/);
    if (roleEditMatch && req.method === 'PUT') return this._editRole(req, res, decodeURIComponent(roleEditMatch[1]));

    // ---- Legacy Hub APIs ----
    if (p === '/api/hub/search') return this._hubSearch(res, url);
    if (p === '/api/hub/industries') return this._json(res, this.hub.listIndustries());
    if (p === '/api/hub/popular') return this._json(res, this.hub.getPopular(parseInt(url.searchParams.get('limit')) || 20));
    const hubRoleMatch = p.match(/^\/api\/hub\/roles\/([^/]+)$/);
    if (hubRoleMatch && req.method === 'GET') return this._hubRoleDetail(res, decodeURIComponent(hubRoleMatch[1]));
    const hubRateMatch = p.match(/^\/api\/hub\/roles\/([^/]+)\/rate$/);
    if (hubRateMatch && req.method === 'POST') return this._hubRate(req, res, decodeURIComponent(hubRateMatch[1]));
    const hubExportMatch = p.match(/^\/api\/hub\/roles\/([^/]+)\/export$/);
    if (hubExportMatch && req.method === 'POST') return this._hubExport(req, res, decodeURIComponent(hubExportMatch[1]));

    // ---- Legacy APIs (backward compat) ----
    if (p === '/api/roles/search') return this._search(res, url.searchParams.get('q') || '');
    if (p === '/api/roles/popular') return this._popular(res);
    if (p === '/api/categories') return this._categories(res);
    const catRolesMatch = p.match(/^\/api\/categories\/([^/]+)\/roles$/);
    if (catRolesMatch) return this._categoryRoles(res, decodeURIComponent(catRolesMatch[1]));
    const legacyRoleMatch = p.match(/^\/api\/roles\/([^/]+)\/([^/]+)$/);
    if (legacyRoleMatch) return this._roleDetail(res, decodeURIComponent(legacyRoleMatch[1]), decodeURIComponent(legacyRoleMatch[2]));

    // Serve hub UI
    if (p === '/hub' || p === '/hub/') {
      const htmlPath = path.join(this.hubStaticDir, 'index.html');
      if (fs.existsSync(htmlPath)) {
        this._cors(res);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
    }

    // Serve index.html for SPA
    if (!p.startsWith('/api/')) {
      const htmlPath = path.join(this.staticDir, 'index.html');
      if (fs.existsSync(htmlPath)) {
        this._cors(res);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
    }

    this._json(res, { error: 'Not found' }, 404);
  }

  // ---- New APIs ----

  _stats(res) {
    const cats = getCategories();
    let totalRoles = 0;
    const functions = new Set();
    for (const c of cats) {
      totalRoles += c.roles.length;
      functions.add(c.name);
    }
    this._json(res, { totalRoles, industries: cats.length, functions: functions.size });
  }

  _templates(res, url) {
    const cats = getCategories();
    const industry = url.searchParams.get('industry');
    const func = url.searchParams.get('function');
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 50;

    let all = [];
    for (const c of cats) {
      if (industry && c.name !== industry) continue;
      if (func && c.name !== func) continue;
      for (const r of c.roles) {
        const meta = this._getTemplateMeta(c.name, r);
        all.push(meta);
      }
    }

    if (q) {
      all = all.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.titleZh.includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    this._json(res, { total, page, limit, items });
  }

  _getTemplateMeta(category, roleName) {
    const rolePath = path.join(ROLES_DIR, category, roleName);
    const oadPath = path.join(rolePath, 'oad.yaml');
    let title = roleName.replace(/-/g, ' ');
    let titleZh = '';
    let description = '';
    let descZh = '';
    let tags = [];

    if (fs.existsSync(oadPath)) {
      const oad = fs.readFileSync(oadPath, 'utf8');
      const enTitle = oad.match(/title:\s*\n\s*en:\s*"?([^"\n]+)"?/);
      if (enTitle) title = enTitle[1];
      const zhTitle = oad.match(/zh:\s*"?([^"\n]+)"?/);
      if (zhTitle) titleZh = zhTitle[1];
      const enDesc = oad.match(/description:\s*\n\s*en:\s*"?([^"\n]+)"?/);
      if (enDesc) description = enDesc[1];
      const zhDesc = oad.match(/description:\s*\n\s*en:\s*"?[^"\n]+"?\s*\n\s*zh:\s*"?([^"\n]+)"?/);
      if (zhDesc) descZh = zhDesc[1];
      const tagsMatch = oad.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);
      if (tagsMatch) tags = tagsMatch[1].match(/-\s*(.+)/g)?.map(t => t.replace(/^-\s*/, '').trim()) || [];
    }

    const hasBrainSeed = fs.existsSync(path.join(rolePath, 'brain-seed.md'));
    const hasWorkstationSeed = fs.existsSync(path.join(rolePath, 'workstation-seed.md'));

    return {
      id: `${category}/${roleName}`,
      name: roleName,
      category,
      title,
      titleZh,
      description,
      descZh,
      tags,
      hasBrainSeed,
      hasWorkstationSeed,
    };
  }

  _templateDetail(res, category, roleName) {
    const data = getRole(category, roleName);
    if (!data) return this._json(res, { error: 'Template not found' }, 404);

    const meta = this._getTemplateMeta(category, roleName);
    const systemPrompt = data.files['system-prompt.md'] || data.files['prompts/system.md'] || '';
    const brainSeed = data.files['brain-seed.md'] || '';
    const workstationSeed = data.files['workstation-seed.md'] || '';
    const readme = data.files['README.md'] || data.files['readme.md'] || '';
    const industrySeed = getIndustryBrainSeed(category) || '';

    this._json(res, {
      ...meta,
      systemPrompt,
      brainSeed,
      workstationSeed,
      industrySeed,
      readme,
      files: Object.keys(data.files),
    });
  }

  _industries(res) {
    const cats = getCategories();
    const industries = cats.map(c => ({
      id: c.name,
      name: c.name.replace(/-/g, ' '),
      roleCount: c.roles.length,
    }));
    this._json(res, industries);
  }

  _industryDetail(res, industryId) {
    const cats = getCategories();
    const cat = cats.find(c => c.name === industryId);
    if (!cat) return this._json(res, { error: 'Industry not found' }, 404);

    const roles = cat.roles.map(r => this._getTemplateMeta(cat.name, r));
    const industrySeed = getIndustryBrainSeed(industryId) || '';

    this._json(res, {
      id: cat.name,
      name: cat.name.replace(/-/g, ' '),
      roleCount: cat.roles.length,
      industrySeed,
      roles,
    });
  }

  _brainSeeds(res, url) {
    const cats = getCategories();
    const industry = url.searchParams.get('industry');
    const seeds = [];

    for (const c of cats) {
      if (industry && c.name !== industry) continue;

      // Industry-level seed
      const iSeed = getIndustryBrainSeed(c.name);
      if (iSeed) {
        seeds.push({
          id: `${c.name}/_industry`,
          type: 'industry',
          category: c.name,
          role: null,
          title: `${c.name} Industry Knowledge`,
          preview: iSeed.substring(0, 200),
          applicableRoles: c.roles,
        });
      }

      // Role-level seeds
      for (const r of c.roles) {
        const jSeed = getJobBrainSeed(c.name, r);
        if (jSeed) {
          seeds.push({
            id: `${c.name}/${r}`,
            type: 'job',
            category: c.name,
            role: r,
            title: `${r.replace(/-/g, ' ')} Knowledge`,
            preview: jSeed.substring(0, 200),
            applicableRoles: [r],
          });
        }
        const wSeed = getWorkstationBrainSeed(c.name, r);
        if (wSeed) {
          seeds.push({
            id: `${c.name}/${r}/workstation`,
            type: 'workstation',
            category: c.name,
            role: r,
            title: `${r.replace(/-/g, ' ')} Workstation Seed`,
            preview: wSeed.substring(0, 200),
            applicableRoles: [r],
          });
        }
      }
    }

    this._json(res, seeds);
  }

  _brainSeedDetail(res, category, roleName) {
    const jSeed = getJobBrainSeed(category, roleName);
    const wSeed = getWorkstationBrainSeed(category, roleName);
    const iSeed = getIndustryBrainSeed(category);

    if (!jSeed && !wSeed && !iSeed) return this._json(res, { error: 'Brain seed not found' }, 404);

    this._json(res, {
      category,
      role: roleName,
      industrySeed: iSeed || '',
      jobSeed: jSeed || '',
      workstationSeed: wSeed || '',
    });
  }

  // ---- Custom Roles CRUD ----

  async _createRole(req, res) {
    const body = await this._readBody(req);
    if (!body.name) return this._json(res, { error: 'Name is required' }, 400);

    const id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!id) return this._json(res, { error: 'Invalid name' }, 400);

    if (!fs.existsSync(CUSTOM_ROLES_DIR)) fs.mkdirSync(CUSTOM_ROLES_DIR, { recursive: true });
    const rolePath = path.join(CUSTOM_ROLES_DIR, `${id}.json`);
    const role = { id, ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    fs.writeFileSync(rolePath, JSON.stringify(role, null, 2));
    this._json(res, role, 201);
  }

  async _editRole(req, res, id) {
    const rolePath = path.join(CUSTOM_ROLES_DIR, `${id}.json`);
    if (!fs.existsSync(rolePath)) return this._json(res, { error: 'Role not found' }, 404);

    const existing = JSON.parse(fs.readFileSync(rolePath, 'utf8'));
    const body = await this._readBody(req);
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    fs.writeFileSync(rolePath, JSON.stringify(updated, null, 2));
    this._json(res, updated);
  }

  _customRoles(res) {
    if (!fs.existsSync(CUSTOM_ROLES_DIR)) return this._json(res, []);
    const files = fs.readdirSync(CUSTOM_ROLES_DIR).filter(f => f.endsWith('.json'));
    const roles = files.map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(CUSTOM_ROLES_DIR, f), 'utf8')); }
      catch { return null; }
    }).filter(Boolean);
    this._json(res, roles);
  }

  // ---- Legacy APIs (kept for backward compat) ----

  _allRoles(res) {
    const cats = getCategories();
    const roles = [];
    for (const c of cats) {
      for (const r of c.roles) roles.push({ category: c.name, role: r });
    }
    this._json(res, roles);
  }

  _search(res, q) { this._json(res, searchRoles(q)); }
  _popular(res) { this._json(res, getPopularRoles()); }
  _categories(res) { this._json(res, getCategories()); }

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
    const systemPrompt = data.files['system-prompt.md'] || data.files['prompts/system.md'] || '';
    const brainSeed = data.files['brain-seed.md'] || '';
    const readme = data.files['README.md'] || data.files['readme.md'] || '';
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
