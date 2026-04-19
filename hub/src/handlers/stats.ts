import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateIndex } from '../types';

const INDEX_FILE = path.resolve(__dirname, '../../templates.json');

export function handleStats(_req: IncomingMessage, res: ServerResponse) {
  const index: TemplateIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  const categories = new Set(index.templates.map(t => t.category));
  const withBrainSeed = index.templates.filter(t => t.hasBrainSeed).length;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    total: index.total,
    categories: categories.size,
    categoriesList: [...categories].sort(),
    withBrainSeed,
    generatedAt: index.generatedAt,
  }));
}
