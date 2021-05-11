const { version } = require('../package.json');

/**
 * Get application version by importing from the `package.json`.
 */
const getVersion = () => Math.round(version.substr(0, 3));

module.exports = getVersion;
