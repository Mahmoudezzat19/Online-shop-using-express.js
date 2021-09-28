const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Mbatsh191718', {
    'host': 'localhost',
    'dialect': 'mysql'
});

let test_connection = async function() {
    try {
        await sequelize.authenticate();
        console.log("connection granted");
    } catch (error) {
        console.log("unable to connect");
    }
}

test_connection();

module.exports = sequelize;
