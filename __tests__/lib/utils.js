import * as path from 'path';
import fixtures from 'sequelize-fixtures';
import getApp from '../../server';

const initTestDatabse = async (app) => {
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
  await initTestDatabse(app);
  return app;
};

export { initTestDatabse, createTestApp };
