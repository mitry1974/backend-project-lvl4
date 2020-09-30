import path from 'path';
import Sequelize from 'sequelize';
import { dirname  } from 'path';
import { fileURLToPath  } from 'url';
import config from '../../../dbconfig.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = {};

const models = ['User.js', 'Task.js', 'Guest.js', 'TaskStatus.js', 'Tag.js', 'TaskTags.js'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

models.forEach(async (file) => {
  // eslint-disable-next-line
  const filename = path.join(__dirname, file);
  const modelFunc = await import(filename);
  const model = modelFunc.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
