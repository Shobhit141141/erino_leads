const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const logger = require("./src/utils/logger");
const { connectDB } = require("./src/config/db");
const routes = require("./src/routes/index.route.js");
const CONSTANTS = require("./src/config/constants.js");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: CONSTANTS.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.send("Welcome to the API");
});
app.use("/api", routes);

const startServer = async () => {
  await connectDB();
  const PORT = CONSTANTS.PORT || 4000;
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

startServer();

module.exports = app;
