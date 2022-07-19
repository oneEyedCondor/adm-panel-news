import 'dotenv/config';

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    seederStorage: 'sequelize',
  },
  test: {
    username: 'root',
    password: 'passwd',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'passwd',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
