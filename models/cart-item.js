const { Sequelize, Datatypes, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('CartItem', {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
})

module.exports = CartItem;