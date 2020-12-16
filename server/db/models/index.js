const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../../dbconfig');

const createSequelize = () => {
  // let sequelize;
  console.log('========================================>');
  console.log(config);
  // if (config.use_env_variable) {
  //   console.log(process.env[config.use_env_variable]);
  //   sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // } else {
  //   sequelize = new Sequelize(config.database, config.username, config.password, config);
  // }
  const sequelize = new Sequelize(config);
  return sequelize;
};

const initializeModels = (sequelize) => {
  const instance = sequelize || createSequelize();
  const models = {};
  const modelFiles = ['User.js', 'Task.js', 'Guest.js', 'TaskStatus.js', 'Tag.js', 'TaskTags.js'];
  modelFiles.forEach((file) => {
    // eslint-disable-next-line
    const model = require(path.join(__dirname, file))(instance, Sequelize.DataTypes);
    models[model.name] = model;
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

module.exports = initializeModels;
