const config = require('config');

console.log(`Database config: ${JSON.stringify(config.db)}`);

module.exports = config.db;
