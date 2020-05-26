module.exports = {
  db: {
    synchronize: false,
    migrationsRun: true,
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: 'error',
  },
};
