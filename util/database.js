const Sequelize= require('sequelize/index').Sequelize;

const sequelize = new Sequelize(
    'node-complete',
    'root',
    'nodecomplete', 
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;



