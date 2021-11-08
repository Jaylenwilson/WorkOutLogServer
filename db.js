const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:562613@localhost:5432/workout-log");

module.exports = sequelize;