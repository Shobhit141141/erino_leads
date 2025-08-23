const dotenv = require('dotenv')
dotenv.config()


const CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/myapp",
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "dev",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173"
}

module.exports = CONSTANTS