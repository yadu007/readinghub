
module.exports = function(sequelize, Sequelize) {
 
    return sequelize.define('users', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        created_at: {
            type: Sequelize.DATE
        }
 
 
    },
    {
        indexes: [{
            unique: true,
            fields: ['email']
        }, {
            unique: false,
            fields: ['created_at']
        }]
    }
    );
 
    
 
}