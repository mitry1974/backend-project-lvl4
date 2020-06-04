const path = require('path');
const Sequelize = require('sequelize');

const config = require(`${__dirname}/../../../config/dbconfig.js`);
const db = {};


const models = ['User.js', 'Task.js'];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

models.forEach((file) => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
