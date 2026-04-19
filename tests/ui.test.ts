import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const { WorkstationUI } = require('../src/ui/server.js');

const CUSTOM_ROLES_DIR = path.join(__dirname, '..', '.custom-roles');

function get(urlPath: string): Promise<{ status: number; data: any; headers: any }> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4111${urlPath}`, (res) => {
      let body = '';
      res.on('data', (c: Buffer) => (body += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode!, data: JSON.parse(body), headers: res.headers }); }
        catch { resolve({ status: res.statusCode!, data: body, headers: res.headers }); }
      });
    }).on('error', reject);
  });
}

function post(urlPath: string, data: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(`http://localhost:4111${urlPath}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let buf = '';
      res.on('data', (c: Buffer) => (buf += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode!, data: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode!, data: buf }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function put(urlPath: string, data: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(`http://localhost:4111${urlPath}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let buf = '';
      res.on('data', (c: Buffer) => (buf += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode!, data: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode!, data: buf }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

describe('WorkstationUI', () => {
  let ui: any;

  beforeAll(async () => {
    ui = new WorkstationUI({ port: 4111 });
    await ui.start();
    // Clean custom roles
    if (fs.existsSync(CUSTOM_ROLES_DIR)) {
      for (const f of fs.readdirSync(CUSTOM_ROLES_DIR)) fs.unlinkSync(path.join(CUSTOM_ROLES_DIR, f));
    }
  });

  afterAll(async () => {
    await ui.stop();
    // Clean up custom roles
    if (fs.existsSync(CUSTOM_ROLES_DIR)) {
      for (const f of fs.readdirSync(CUSTOM_ROLES_DIR)) fs.unlinkSync(path.join(CUSTOM_ROLES_DIR, f));
      fs.rmdirSync(CUSTOM_ROLES_DIR);
    }
  });

  it('constructor defaults', () => {
    const def = new WorkstationUI();
    expect(def.port).toBe(4003);
  });

  // --- /api/stats ---
  it('GET /api/stats returns totalRoles, industries, functions', async () => {
    const { status, data } = await get('/api/stats');
    expect(status).toBe(200);
    expect(data).toHaveProperty('totalRoles');
    expect(data).toHaveProperty('industries');
    expect(data).toHaveProperty('functions');
    expect(typeof data.totalRoles).toBe('number');
    expect(data.totalRoles).toBeGreaterThan(0);
  });

  // --- /api/templates ---
  it('GET /api/templates returns paginated items', async () => {
    const { status, data } = await get('/api/templates');
    expect(status).toBe(200);
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBe(true);
    if (data.items.length > 0) {
      expect(data.items[0]).toHaveProperty('id');
      expect(data.items[0]).toHaveProperty('name');
      expect(data.items[0]).toHaveProperty('category');
      expect(data.items[0]).toHaveProperty('title');
    }
  });

  it('GET /api/templates?industry=engineering filters', async () => {
    const { data } = await get('/api/templates?industry=engineering');
    expect(data.items.length).toBeGreaterThan(0);
    for (const item of data.items) expect(item.category).toBe('engineering');
  });

  it('GET /api/templates?q=developer searches', async () => {
    const { data } = await get('/api/templates?q=developer');
    expect(data.items.length).toBeGreaterThan(0);
  });

  // --- /api/templates/:category/:role ---
  it('GET /api/templates/:cat/:role returns detail', async () => {
    const { status, data } = await get('/api/templates/engineering/backend-developer');
    expect(status).toBe(200);
    expect(data).toHaveProperty('systemPrompt');
    expect(data).toHaveProperty('brainSeed');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('files');
  });

  it('GET /api/templates/bad/bad returns 404', async () => {
    const { status } = await get('/api/templates/nonexistent/nonexistent');
    expect(status).toBe(404);
  });

  // --- /api/industries ---
  it('GET /api/industries returns list with roleCount', async () => {
    const { status, data } = await get('/api/industries');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('roleCount');
  });

  // --- /api/industries/:id ---
  it('GET /api/industries/:id returns industry detail', async () => {
    const { status, data } = await get('/api/industries/engineering');
    expect(status).toBe(200);
    expect(data).toHaveProperty('roles');
    expect(Array.isArray(data.roles)).toBe(true);
    expect(data.roleCount).toBeGreaterThan(0);
  });

  it('GET /api/industries/bad returns 404', async () => {
    const { status } = await get('/api/industries/nonexistent');
    expect(status).toBe(404);
  });

  // --- /api/brain-seeds ---
  it('GET /api/brain-seeds returns seeds', async () => {
    const { status, data } = await get('/api/brain-seeds');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('type');
      expect(data[0]).toHaveProperty('preview');
    }
  });

  it('GET /api/brain-seeds?industry=engineering filters', async () => {
    const { data } = await get('/api/brain-seeds?industry=engineering');
    for (const s of data) expect(s.category).toBe('engineering');
  });

  // --- /api/brain-seeds/:category/:role ---
  it('GET /api/brain-seeds/:cat/:role returns seed detail', async () => {
    const { status, data } = await get('/api/brain-seeds/engineering/backend-developer');
    expect(status).toBe(200);
    expect(data).toHaveProperty('category');
    expect(data).toHaveProperty('role');
  });

  // --- Custom Roles CRUD ---
  it('POST /api/roles creates a custom role', async () => {
    const { status, data } = await post('/api/roles', { name: 'Test Role', description: 'A test', category: 'engineering', systemPrompt: 'You are a test.' });
    expect(status).toBe(201);
    expect(data).toHaveProperty('id', 'test-role');
    expect(data).toHaveProperty('createdAt');
  });

  it('GET /api/roles lists custom roles', async () => {
    const { status, data } = await get('/api/roles');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  it('PUT /api/roles/:id edits a custom role', async () => {
    const { status, data } = await put('/api/roles/test-role', { description: 'Updated desc' });
    expect(status).toBe(200);
    expect(data.description).toBe('Updated desc');
    expect(data).toHaveProperty('updatedAt');
  });

  it('PUT /api/roles/bad returns 404', async () => {
    const { status } = await put('/api/roles/nonexistent', { description: 'x' });
    expect(status).toBe(404);
  });

  it('POST /api/roles without name returns 400', async () => {
    const { status } = await post('/api/roles', { description: 'no name' });
    expect(status).toBe(400);
  });

  // --- Legacy compat ---
  it('GET /api/categories still works', async () => {
    const { status, data } = await get('/api/categories');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/roles/search?q=developer still works', async () => {
    const { status, data } = await get('/api/roles/search?q=developer');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/roles/popular still works', async () => {
    const { status, data } = await get('/api/roles/popular');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  // --- CORS ---
  it('CORS headers present', async () => {
    const { headers } = await get('/api/stats');
    expect(headers['access-control-allow-origin']).toBe('*');
  });

  // --- SPA ---
  it('GET / serves HTML', async () => {
    const { status, data } = await get('/');
    expect(status).toBe(200);
    expect(typeof data).toBe('string');
    expect(data).toContain('Template Market');
  });

  it('GET /templates serves SPA HTML', async () => {
    const { status, data } = await get('/templates');
    expect(status).toBe(200);
    expect(typeof data).toBe('string');
  });

  // --- 404 ---
  it('404 for unknown API', async () => {
    const { status } = await get('/api/nonexistent');
    expect(status).toBe(404);
  });
});
