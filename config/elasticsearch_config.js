var elasticsearch = require('elasticsearch');

function bindToAppLogger(logger) {
    return function(config) {
        this.error   = logger.error.bind(logger);
        this.warning = logger.warn.bind(logger);
        this.info    = logger.info.bind(logger);
        this.debug   = logger.debug.bind(logger);
        this.trace   = function(method, requestUrl, body, responseBody,
                responseStatus) {};
        this.close   = function() {};
    };
}

module.exports = function(logger) {
   
        var client = new elasticsearch.Client({
            hosts:         ['localhost:9200'],
            log:           bindToAppLogger(logger),
            apiVersion:    '6.1',
            requestTimeout: 100000,
        });
    

    client.ping({
        requestTimeout: 100000,
        pretty:         ''
    }, function(error) {
        if (error) {
            logger.error('[ElasticSearch] Cluster is down!');
            process.exit();
        } else {
            logger.info('[ElasticSearch] Cluster is online.');
        }
    });

    return client;
}

