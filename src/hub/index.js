const { readFileSync, writeFileSync, existsSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const { SearchEngine } = require('./search-engine');
const { RoleExporter } = require('./exporter');

const ROLES_DIR = join(__dirname, '..', '..', 'roles');
const RATINGS_FILE = join(__dirname, '..', '..', '.hub-ratings.json');

/**
 * WorkstationHub — Template marketplace for browsing, searching, and exporting agent role templates.
 */
class WorkstationHub {
  constructor(rolesDir) {
    this.rolesDir = rolesDir || ROLES_DIR;
    this._roles = null;
    this._searchEngine = null;
    this._ratings = this._loadRatings();
    this.exporter = new RoleExporter();
  }

  /** Load all roles into memory (lazy). */
  _getRoles() {
    if (this._roles) return this._roles;
    this._roles = [];

    const categories = readdirSync(this.rolesDir, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const cat of categories) {
      const catPath = join(this.rolesDir, cat.name);
      const industrySeed = existsSync(join(catPath, 'brain-seed.md'))
        ? readFileSync(join(catPath, 'brain-seed.md'), 'utf8') : '';

      const roles = readdirSync(catPath, { withFileTypes: true })
        .filter(d => d.isDirectory());

      for (const roleDir of roles) {
        const rolePath = join(catPath, roleDir.name);
        const oadPath = join(rolePath, 'oad.yaml');
        let title = roleDir.name.replace(/-/g, ' ');
        let titleCN = '';
        let description = '';
        let descCN = '';
        let tags = [];

        if (existsSync(oadPath)) {
          const oad = readFileSync(oadPath, 'utf8');
          const enTitle = oad.match(/title:\s*\n\s*en:\s*"?([^"\n]+)"?/);
          if (enTitle) title = enTitle[1];
          const zhTitle = oad.match(/zh:\s*"?([^"\n]+)"?/);
          if (zhTitle) titleCN = zhTitle[1];
          const enDesc = oad.match(/description:\s*\n\s*en:\s*"?([^"\n]+)"?/);
          if (enDesc) description = enDesc[1];
          const tagsMatch = oad.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);
          if (tagsMatch) {
            tags = tagsMatch[1].match(/-\s*(.+)/g)?.map(t => t.replace(/^-\s*/, '').trim()) || [];
          }
        }

        const brainSeed = existsSync(join(rolePath, 'brain-seed.md'))
          ? readFileSync(join(rolePath, 'brain-seed.md'), 'utf8') : '';
        const workstationSeed = existsSync(join(rolePath, 'workstation-seed.md'))
          ? readFileSync(join(rolePath, 'workstation-seed.md'), 'utf8') : '';

        this._roles.push({
          id: roleDir.name,
          category: cat.name,
          title,
          titleCN,
          industry: cat.name,
          function: cat.name,
          description,
          tags,
          brainSeed,
          workstationSeed,
          industrySeed: industrySeed,
          _hasWorkstationSeed: workstationSeed.length > 0,
        });
      }
    }
    return this._roles;
  }

  _getSearchEngine() {
    if (!this._searchEngine) {
      this._searchEngine = new SearchEngine(this._getRoles());
    }
    return this._searchEngine;
  }

  _loadRatings() {
    if (existsSync(RATINGS_FILE)) {
      try { return JSON.parse(readFileSync(RATINGS_FILE, 'utf8')); } catch { return {}; }
    }
    return {};
  }

  _saveRatings() {
    writeFileSync(RATINGS_FILE, JSON.stringify(this._ratings, null, 2));
  }

  /**
   * Search roles by keyword with optional filters.
   */
  search(query, filters) {
    return this._getSearchEngine().search(query, filters);
  }

  /**
   * Get full role details including all 3 brain seeds.
   */
  getRoleDetails(roleId) {
    const role = this._getRoles().find(r => r.id === roleId);
    if (!role) return null;
    const ratings = this._ratings[roleId];
    return {
      ...role,
      rating: ratings ? ratings.total / ratings.count : undefined,
      ratingCount: ratings ? ratings.count : 0,
    };
  }

  /**
   * List all industries (categories) with role counts.
   */
  listIndustries() {
    const roles = this._getRoles();
    const map = {};
    for (const r of roles) {
      if (!map[r.category]) map[r.category] = { id: r.category, name: r.category.replace(/-/g, ' '), roleCount: 0 };
      map[r.category].roleCount++;
    }
    return Object.values(map);
  }

  /**
   * List roles by industry (category).
   */
  listByIndustry(industry) {
    return this._getRoles().filter(r => r.industry === industry);
  }

  /**
   * List roles by function.
   */
  listByFunction(fn) {
    return this._getRoles().filter(r => r.function === fn || r.category === fn);
  }

  /**
   * Get recommended roles based on a natural language description.
   */
  recommend(description) {
    return this._getSearchEngine().recommend(description);
  }

  /**
   * Rate a role template.
   */
  rate(roleId, rating, comment) {
    if (rating < 1 || rating > 5) throw new Error('Rating must be 1-5');
    if (!this._ratings[roleId]) this._ratings[roleId] = { total: 0, count: 0, comments: [] };
    this._ratings[roleId].total += rating;
    this._ratings[roleId].count += 1;
    if (comment) this._ratings[roleId].comments.push({ rating, comment, date: new Date().toISOString() });
    this._saveRatings();
  }

  /**
   * Get popular/trending roles.
   */
  getPopular(limit = 20) {
    const roles = this._getRoles();
    // Roles with ratings first, then by whether they have all seeds
    return roles
      .map(r => {
        const ratings = this._ratings[r.id];
        const ratingScore = ratings ? (ratings.total / ratings.count) * ratings.count : 0;
        const seedScore = (r.brainSeed ? 1 : 0) + (r.workstationSeed ? 1 : 0) + (r.industrySeed ? 1 : 0);
        return { ...r, _popularScore: ratingScore + seedScore };
      })
      .sort((a, b) => b._popularScore - a._popularScore)
      .slice(0, limit);
  }

  /**
   * Export a role as a standalone agent package.
   */
  async exportRole(roleId, outputDir) {
    const details = this.getRoleDetails(roleId);
    if (!details) throw new Error(`Role not found: ${roleId}`);
    return this.exporter.export(details, outputDir);
  }
}

module.exports = { WorkstationHub };
