import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';

const { WorkstationUI } = require('../src/ui/server.js');

function get(path: string): Promise<{ status: number; data: any; headers: any }> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4111${path}`, (res) => {
      let body = '';
      res.on('data', (c: Buffer) => (body += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode!, data: JSON.parse(body), headers: res.headers }); }
        catch { resolve({ status: res.statusCode!, data: body, headers: res.headers }); }
      });
    }).on('error', reject);
  });
}

describe('WorkstationUI', () => {
  let ui: any;

  beforeAll(async () => {
    ui = new WorkstationUI({ port: 4111 });
    await ui.start();
  });

  afterAll(async () => {
    await ui.stop();
  });

  it('constructor defaults', () => {
    const def = new WorkstationUI();
    expect(def.port).toBe(4003);
    expect(def.staticDir).toBeDefined();
  });

  it('GET /api/roles returns array', async () => {
    const { status, data } = await get('/api/roles');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('role');
    }
  });

  it('GET /api/categories returns array', async () => {
    const { status, data } = await get('/api/categories');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('roles');
    }
  });

  it('GET /api/roles/search?q=developer returns results', async () => {
    const { status, data } = await get('/api/roles/search?q=developer');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/stats returns counts', async () => {
    const { status, data } = await get('/api/stats');
    expect(status).toBe(200);
    expect(data).toHaveProperty('totalRoles');
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('industries');
    expect(typeof data.totalRoles).toBe('number');
  });

  it('404 for unknown API route', async () => {
    const { status, data } = await get('/api/nonexistent');
    expect(status).toBe(404);
    expect(data).toHaveProperty('error');
  });

  it('CORS headers present', async () => {
    const { headers } = await get('/api/stats');
    expect(headers['access-control-allow-origin']).toBe('*');
  });
});
