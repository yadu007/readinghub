const { createLogger, format, transports } = require('winston');
var logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
              ),
            level: 'debug',
            handleExceptions: true,
            
            timestamp: true
        })
    ],
    exitOnError: false
});

module.exports = logger;

