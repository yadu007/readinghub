
var Sequelize = require('sequelize');

module.exports = (logger)=> {
        var host      = "localhost";
        var port      = "3306";
        var username  = "yzcop";
        var password  = "";
    
    var database  = "apitest";
    var protocol  = "mysql";

    var sequelize = new Sequelize(database, username, password, {
        host: host,
        define: {
            timestamps: false,
        },
        port: port,
        dialect: protocol
    });

    sequelize.authenticate().then( ()=> {
        logger.info('Mysql Connection has been established successfully.');
 
    }).catch(()=>{
        logger.error('Something is wrong with Mysql connection:', err);
    });

    return {
        getClient: ()=> {
            return sequelize;
        }
    };
};
