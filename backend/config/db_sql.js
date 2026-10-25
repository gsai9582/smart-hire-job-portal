const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.SQL_DB || 'jobportal',
  process.env.SQL_USER || 'root',
  process.env.SQL_PASS || '',
  {
    host: process.env.SQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // set to console.log to see the raw SQL queries
  }
);

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQL Database Connected successfully.');
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ SQL Models synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the SQL database:', error);
  }
};

module.exports = { sequelize, connectSQL };
