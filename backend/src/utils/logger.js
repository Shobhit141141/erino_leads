const path = require("path");
const fs = require("fs");
const winston = require("winston");

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
};
winston.addColors(logColors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat
      ),
    }),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message.trim());
  },
};

module.exports = logger;
