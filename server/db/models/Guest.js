module.exports = (sequelize, DataTypes) => { // eslint-disable-line
  const Guest = sequelize.define('Guest', {

  }, { sequelize, modelName: 'Guest' });

  return Guest;
};
