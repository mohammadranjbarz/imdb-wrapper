'user strict';

let config = require('nconf');
config.argv()
    .env()
    .file({ file: './server-config.json' });

module.exports = config;