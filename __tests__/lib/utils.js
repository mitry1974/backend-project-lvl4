import * as path from 'path';
import fixtures from 'sequelize-fixtures';
import getApp from '../../server';

const clearDb = async () => {
  // const connection = getConnection('default');
  // if (connection.isConnected) {
  //   await connection.dropDatabase();
  //   await connection.close();
  // }
};

const loadFixtures = async (app) => {
  try {
    const { models } = app.db;
    await models.User.sync({ force: true });
    await models.TaskStatus.sync({ force: true });
    await models.Tag.sync({ force: true });
    await models.Task.sync({ force: true });
    await models.TaskTags.sync({ force: true });

    const fixturesFilename = path.resolve(__dirname, '../__fixtures__/fixtures.json');
    await fixtures.loadFile(fixturesFilename, models);
  } catch (err) {
    console.log(`Load fixtures error - ${err.message}`);
    throw err;
  }
};

const createTestApp = async () => {
  const app = await getApp();
  await loadFixtures(app);
  await app.listen();
  return app;
};

export { loadFixtures, clearDb, createTestApp };
