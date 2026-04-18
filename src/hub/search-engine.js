const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

/**
 * Simple search engine for role templates.
 * Supports fuzzy matching on EN/CN names, tag matching, industry/function filtering.
 */
class SearchEngine {
  constructor(roles) {
    /** @type {import('./types').RoleInfo[]} */
    this.roles = roles;
  }

  /**
   * Search roles with query and filters.
   * @param {string} query
   * @param {import('./types').HubFilters} [filters]
   * @returns {import('./types').RoleSearchResult[]}
   */
  search(query, filters = {}) {
    const q = (query || '').toLowerCase().trim();
    const words = q ? q.split(/\s+/).filter(Boolean) : [];

    let results = this.roles.map(role => {
      let score = 0;

      if (words.length > 0) {
        const haystack = `${role.id} ${role.title} ${role.titleCN} ${role.description} ${(role.tags || []).join(' ')}`.toLowerCase();
        const allMatch = words.every(w => haystack.includes(w));
        if (!allMatch) return null;

        // Scoring: exact id match > title match > tag match > description match
        if (role.id.toLowerCase().includes(q)) score += 100;
        if (role.title.toLowerCase().includes(q)) score += 80;
        if (role.titleCN && role.titleCN.includes(q)) score += 80;
        if ((role.tags || []).some(t => t.toLowerCase().includes(q))) score += 40;
        words.forEach(w => {
          if (role.title.toLowerCase().includes(w)) score += 10;
          if (role.id.toLowerCase().includes(w)) score += 10;
        });
      } else {
        score = 1; // Return all if no query
      }

      return { ...role, score };
    }).filter(Boolean);

    // Apply filters
    if (filters.industry) {
      results = results.filter(r => r.industry === filters.industry || r.category === filters.industry);
    }
    if (filters.function) {
      results = results.filter(r => r.function === filters.function || r.category === filters.function);
    }
    if (filters.hasWorkstationSeed) {
      results = results.filter(r => r._hasWorkstationSeed);
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Recommend roles based on a natural language description.
   * @param {string} description
   * @returns {import('./types').RoleSearchResult[]}
   */
  recommend(description) {
    const words = description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return this.roles.map(role => {
      const haystack = `${role.id} ${role.title} ${role.titleCN} ${role.description} ${(role.tags || []).join(' ')}`.toLowerCase();
      let score = 0;
      words.forEach(w => {
        if (haystack.includes(w)) score += 1;
      });
      return { ...role, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 10);
  }
}

module.exports = { SearchEngine };
