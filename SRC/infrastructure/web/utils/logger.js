const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, json, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
  level: "debug", // livelli: error, warn, info, http, verbose, debug, silly
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat)
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" })
  ]
});


module.exports = logger;