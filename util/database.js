const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('heroku_05c1e2fb6b8593d', 'ba77dfa39fd886', '0d425f98', {
    'host': 'us-cdbr-east-04.cleardb.com',
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

//mysql://
//ba77dfa39fd886

//0d425f98

//us-cdbr-east-04.cleardb.com

