const { createLogger, transports, format } = require("winston");
const path = require("path");
const root = require("./root");
const { DateTime } = require("luxon");

require("dotenv").config({ path: "../.env" });

class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.route = route;

    const loggers = {
      error: createLogger({
        level: "error",
        format: format.combine(
          format.timestamp({ format: this.setTimeZone }),
          format.align(),
          format.printf((info) => {
            return `[${info.timestamp}]\t[${info.level.toUpperCase()}] ${
              info.message
            }`;
          })
        ),
        transports: [
          new transports.File({
            filename: path.join(root, "logfiles", "error.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 7,
            colorize: false,
            handleExceptions: true,
            zippedArchive: true,
          }),
        ],
        exitOnError: false,
      }),
      info: createLogger({
        level: "info",
        format: format.combine(
          format.timestamp({ format: this.setTimeZone }),
          format.align(),
          format.printf((info) => {
            return `[${info.timestamp}]\t[${info.level.toUpperCase()}] ${
              info.message
            }`;
          })
        ),
        transports: [
          new transports.File({
            filename: path.join(root, "logfiles", "info.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 7,
            colorize: false,
            handleExceptions: true,
            zippedArchive: true,
          }),
          new transports.Console({
            handleExceptions: true,
            colorize: true,
          }),
        ],
        exitOnError: false,
      }),
      warn: createLogger({
        level: "warn",
        format: format.combine(
          format.timestamp({ format: this.setTimeZone }),
          format.align(),
          format.printf((info) => {
            return `[${info.timestamp}]\t[${info.level.toUpperCase()}] ${
              info.message
            }`;
          })
        ),
        transports: [
          new transports.File({
            filename: path.join(root, "logfiles", "warning.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 7,
            colorize: false,
            handleExceptions: true,
            zippedArchive: true,
          }),
        ],
        exitOnError: false,
      }),
    };
    this.logger = loggers;
  }

  log = (message) => {
    switch (message.logger.toLowerCase()) {
      case "info":
        this.logger.info.info(message.message);
        break;

      case "error":
        this.logger.error.error(message.message);
        break;

      case "warning":
        this.logger.warn.warn(message.message);
        break;

      default:
        break;
    }
  };

  setTimeZone = () => {
    return DateTime.local().toISO();
  };
}

const logger = new LoggerService();

module.exports = logger;
