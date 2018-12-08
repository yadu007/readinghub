var elasticsearch = require('elasticsearch');



module.exports = function(logger) {
   
        var client = new elasticsearch.Client({
            hosts:         ['localhost:9200'],
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

