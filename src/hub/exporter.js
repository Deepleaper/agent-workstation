const { mkdirSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

/**
 * Export a role as a standalone agent directory.
 */
class RoleExporter {
  /**
   * @param {object} roleDetails - Full role details with seeds
   * @param {string} outputDir - Output directory path
   * @returns {Promise<string>} Path to exported directory
   */
  async export(roleDetails, outputDir) {
    const agentDir = join(outputDir, roleDetails.id);
    mkdirSync(agentDir, { recursive: true });
    mkdirSync(join(agentDir, 'brain-seeds'), { recursive: true });
    mkdirSync(join(agentDir, 'src'), { recursive: true });

    // opc.yaml
    writeFileSync(join(agentDir, 'opc.yaml'), `oad: 0.1.0
kind: agent
metadata:
  name: ${roleDetails.id}
  title:
    en: "${roleDetails.title}"
    zh: "${roleDetails.titleCN || roleDetails.title}"
  description:
    en: "${roleDetails.description}"
  tags: [${(roleDetails.tags || []).map(t => `"${t}"`).join(', ')}]
spec:
  brain-seeds:
    industry: brain-seeds/industry.md
    job: brain-seeds/job.md
    workstation: brain-seeds/workstation.md
  context: CONTEXT.md
`);

    // CONTEXT.md
    writeFileSync(join(agentDir, 'CONTEXT.md'), `# ${roleDetails.title}

## Role
${roleDetails.description}

## Industry
${roleDetails.industry || 'General'}

## Function
${roleDetails.function || roleDetails.category || 'General'}

---
*Generated from agent-workstation template: ${roleDetails.id}*
`);

    // Brain seeds
    writeFileSync(join(agentDir, 'brain-seeds', 'industry.md'), roleDetails.industrySeed || '# Industry Knowledge\n\nAdd industry-specific knowledge here.\n');
    writeFileSync(join(agentDir, 'brain-seeds', 'job.md'), roleDetails.brainSeed || '# Job Knowledge\n\nAdd role-specific knowledge here.\n');
    writeFileSync(join(agentDir, 'brain-seeds', 'workstation.md'), roleDetails.workstationSeed || '# Workstation Configuration\n\nAdd workstation setup here.\n');

    // package.json
    writeFileSync(join(agentDir, 'package.json'), JSON.stringify({
      name: `agent-${roleDetails.id}`,
      version: '0.1.0',
      description: roleDetails.description,
      main: 'src/index.js',
      scripts: { start: 'node src/index.js' },
      dependencies: {},
    }, null, 2));

    // src/index.js boilerplate
    writeFileSync(join(agentDir, 'src', 'index.js'), `// ${roleDetails.title} Agent
// Generated from agent-workstation template

const config = require('../opc.yaml');

console.log('Agent ${roleDetails.id} starting...');
// TODO: Implement agent logic
`);

    return agentDir;
  }
}

module.exports = { RoleExporter };
