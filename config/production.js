module.exports = {
  db: {
    synchronize: true,
    type: 'postgres',
    port: 15024,
    'url': process.env.DATABASE_URL,
    logging: 'error',
  },
};
