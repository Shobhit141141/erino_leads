const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const logger = require("./src/utils/logger");
const { connectDB } = require("./src/config/db");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

startServer();
