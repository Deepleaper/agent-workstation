import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { TemplateIndex, TemplateDetail } from '../types';

const ROLES_DIR = path.resolve(__dirname, '../../../roles');
const INDEX_FILE = path.resolve(__dirname, '../../templates.json');

export function handleTemplate(_req: IncomingMessage, res: ServerResponse, params: Record<string, string>) {
  const index: TemplateIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  // id can be "category/role" passed as a single param via wildcard
  const id = `${params.category}/${params.role}`;
  const info = index.templates.find(t => t.id === id);

  if (!info) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Template not found' }));
    return;
  }

  const rolePath = path.join(ROLES_DIR, info.category, id.split('/')[1]);
  const oadFile = path.join(rolePath, 'oad.yaml');
  const oad = yaml.load(fs.readFileSync(oadFile, 'utf-8')) as Record<string, any>;

  // Load brain-seed content
  const brainSeed: { file: string; content: string }[] = [];
  const brainSeedDir = path.join(rolePath, 'brain-seed');
  const brainSeedMd = path.join(rolePath, 'brain-seed.md');
  if (fs.existsSync(brainSeedDir) && fs.statSync(brainSeedDir).isDirectory()) {
    for (const f of fs.readdirSync(brainSeedDir).filter(f => f.endsWith('.md'))) {
      brainSeed.push({ file: f, content: fs.readFileSync(path.join(brainSeedDir, f), 'utf-8') });
    }
  } else if (fs.existsSync(brainSeedMd)) {
    brainSeed.push({ file: 'brain-seed.md', content: fs.readFileSync(brainSeedMd, 'utf-8') });
  }

  // Load system prompt if exists
  let systemPrompt: string | undefined;
  const spFile = path.join(rolePath, 'system-prompt.md');
  if (fs.existsSync(spFile)) systemPrompt = fs.readFileSync(spFile, 'utf-8');

  const detail: TemplateDetail = { ...info, oad, brainSeed, systemPrompt };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(detail));
}
