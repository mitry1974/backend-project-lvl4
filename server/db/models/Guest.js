const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => { // eslint-disable-line
  class Guest extends Model {
  }

  Guest.init({

  }, { sequelize, modelName: 'Guest' });

  return Guest;
};
