var config = require('../config/globals');

var logger = config.logger;
var db     = config.mysql.getClient();

var Users   = db.import('./users');

Users.sync().then(function () {
    logger.info('Done syncing Users table.');
    return;
}).catch(function (error) {
    logger.error('Error on creating mysql table for Users.', error);
});
