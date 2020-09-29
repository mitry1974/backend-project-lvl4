import * as path from 'path';
import fixtures from 'sequelize-fixtures';
import Models from '../../server/db/models';
import getApp from '../../server';

const clearDb = async () => {
  // const connection = getConnection('default');
  // if (connection.isConnected) {
  //   await connection.dropDatabase();
  //   await connection.close();
  // }
};

const loadFixtures = async () => {
  try {
    await Models.User.sync({ force: true });
    await Models.TaskStatus.sync({ force: true });
    await Models.Tag.sync({ force: true });
    await Models.Task.sync({ force: true });
    await Models.TaskTags.sync({ force: true });

    const fixturesFilename = path.resolve(__dirname, '../__fixtures__/fixtures.yml');
    await fixtures.loadFile(fixturesFilename, Models);
  } catch (err) {
    console.log(`Load fixtures error - ${err.message}`);
    throw err;
  }
};

const createTestApp = async () => {
  const app = await getApp();
  await loadFixtures();
  await app.listen();
  return app;
};

export { loadFixtures, clearDb, createTestApp };
