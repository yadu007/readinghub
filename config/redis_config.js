
var redis = require('redis');
var config = require('./redis_cred');

module.exports = (logger)=> {
  var host = config.host;
  var port = config.port;
  var password = {
    auth_pass: config.password
  };

var client =  redis.createClient(port, host, password)
    client.on('error', (err)=> {
      logger.error('::Error on Redis initializing::');
    });
    client.on('connect', ()=> {
      logger.debug('::Redis connection success::');
    });
    client.select(10, (re)=> {
      logger.debug('::New client switched to Redis db:::', re);
    });
  
  return client ;
}
