import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateIndex } from '../types';

const INDEX_FILE = path.resolve(__dirname, '../../templates.json');

function loadIndex(): TemplateIndex {
  return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
}

export function handleTemplates(_req: IncomingMessage, res: ServerResponse, _params: Record<string, string>, query: Record<string, string>) {
  const index = loadIndex();
  let templates = index.templates;

  // Search filter
  if (query.q) {
    const q = query.q.toLowerCase();
    templates = templates.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.titleZh.includes(q) ||
      t.id.includes(q) ||
      t.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  // Industry/category filter
  if (query.industry || query.category) {
    const cat = (query.industry || query.category)!.toLowerCase();
    templates = templates.filter(t => t.category.toLowerCase() === cat);
  }

  const total = templates.length;
  const offset = parseInt(query.offset || '0', 10);
  const limit = parseInt(query.limit || '20', 10);
  templates = templates.slice(offset, offset + limit);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ total, offset, limit, templates }));
}
