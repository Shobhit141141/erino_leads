const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");
    await sequelize.sync({ alter: true });
    logger.info("Database synchronized successfully.");
  } catch (error) {
    logger.error("Unable to connect to or synchronize the database:", error);
    process.exit(1);
  }
};
module.exports = { sequelize, connectDB };
