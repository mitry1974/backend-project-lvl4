module.exports = {
  db: {
    synchronize: false,
    migrationsRun: true,
    type: 'postgres',
    port: 15024,
    url: process.env.DATABASE_URL,
    logging: 'error',
  },
};
