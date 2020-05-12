module.exports = {
  db: {
    synchronize: true,
    type: 'postgres',
    host: 'localhost',
    port: 15024,
    database: 'taskman',
    username: 'test',
    password: 'test',
    logging: 'all',
  },
  SESSION_KEY: 'TktUgi5W6njYKwNkNcUEAeQ2Fd2gGwOS',
  ROLLBAR_KEY: '23a9724b36ab4d1db5ddf0d11ec3f2be',
};
