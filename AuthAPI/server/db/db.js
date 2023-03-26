const { Sequelize, Model, DataTypes } = require('sequelize');
require('../common/env');

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

const User = sequelize.define('user', {
  email: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  passwordHash: DataTypes.TEXT,
});

module.exports = {
  sequelize,
  User,
};
