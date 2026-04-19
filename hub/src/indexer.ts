import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { TemplateInfo, TemplateIndex } from './types';

const ROLES_DIR = path.resolve(__dirname, '../../roles');
const INDEX_FILE = path.resolve(__dirname, '../templates.json');

function scanRoles(): TemplateInfo[] {
  const templates: TemplateInfo[] = [];
  const categories = fs.readdirSync(ROLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const cat of categories) {
    const catPath = path.join(ROLES_DIR, cat.name);
    const roles = fs.readdirSync(catPath, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const role of roles) {
      const rolePath = path.join(catPath, role.name);
      const oadFile = path.join(rolePath, 'oad.yaml');
      if (!fs.existsSync(oadFile)) continue;

      try {
        const oad = yaml.load(fs.readFileSync(oadFile, 'utf-8')) as any;
        
        // Check for brain-seed directory or brain-seed.md
        let brainSeedFiles: string[] = [];
        const brainSeedDir = path.join(rolePath, 'brain-seed');
        const brainSeedMd = path.join(rolePath, 'brain-seed.md');
        if (fs.existsSync(brainSeedDir) && fs.statSync(brainSeedDir).isDirectory()) {
          brainSeedFiles = fs.readdirSync(brainSeedDir).filter(f => f.endsWith('.md'));
        } else if (fs.existsSync(brainSeedMd)) {
          brainSeedFiles = ['brain-seed.md'];
        }

        templates.push({
          id: `${cat.name}/${role.name}`,
          category: cat.name,
          title: oad.title || role.name,
          titleZh: oad.title_zh || '',
          description: oad.description || `${oad.title_zh || oad.title} - ${cat.name}`,
          emoji: oad.emoji || '',
          industry: cat.name,
          skills: oad.skills || [],
          metrics: oad.metrics || [],
          hasBrainSeed: brainSeedFiles.length > 0,
          brainSeedFiles,
          downloads: 0,
        });
      } catch (e) {
        console.error(`Error parsing ${oadFile}:`, e);
      }
    }
  }

  return templates.sort((a, b) => a.id.localeCompare(b.id));
}

function main() {
  console.log(`Scanning roles in ${ROLES_DIR}...`);
  const templates = scanRoles();
  const index: TemplateIndex = {
    generatedAt: new Date().toISOString(),
    total: templates.length,
    templates,
  };
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`Generated index: ${templates.length} templates → ${INDEX_FILE}`);
}

main();
