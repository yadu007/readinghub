

const logger = require('./logger_config');
const mysql = require('./mysql_config')(logger);
const redis_cred = require('./redis_cred');
const redis = require('./redis_config')(logger);
const elasticsearch = require('./elasticsearch_config')(logger);

// Module exports.
module.exports = {
    logger: logger,
    mysql: mysql,
    elasticsearch:elasticsearch,
    redis_cred,
    redis
};
