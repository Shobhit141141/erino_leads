const winston = require("winston");

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
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  levels: logLevels,

  format: logFormat,

  transports: [new winston.transports.Console()],

  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message.trim());
  },
};

module.exports = logger;
