/**
 * @typedef {Object} HubFilters
 * @property {string} [industry]
 * @property {string} [function]
 * @property {boolean} [hasWorkstationSeed]
 * @property {string} [language]
 */

/**
 * @typedef {Object} RoleInfo
 * @property {string} id
 * @property {string} category
 * @property {string} title
 * @property {string} titleCN
 * @property {string} industry
 * @property {string} function
 * @property {string} description
 * @property {string[]} tags
 */

/**
 * @typedef {Object} RoleSearchResult
 * @property {string} id
 * @property {string} category
 * @property {string} title
 * @property {string} titleCN
 * @property {string} industry
 * @property {string} function
 * @property {string} description
 * @property {string[]} tags
 * @property {number} score
 */

/**
 * @typedef {Object} RoleDetails
 * @property {string} id
 * @property {string} title
 * @property {string} titleCN
 * @property {string} industry
 * @property {string} function
 * @property {string} description
 * @property {string} brainSeed
 * @property {string} workstationSeed
 * @property {string} industrySeed
 * @property {string[]} tags
 * @property {number} [rating]
 * @property {number} [ratingCount]
 */

/**
 * @typedef {Object} IndustryInfo
 * @property {string} id
 * @property {string} name
 * @property {number} roleCount
 */

module.exports = {};
