import winston from "winston";
import fs from "fs";
import path from "path";

// Ensure the logs directory exists
const logDir = path.join( "./logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, errors } = format;

const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]  ${stack || message}`;
});

const logger = createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    timestamp(),
    errors({ stack: true }), // Capture stack traces for errors
    winstonFormat // Custom format to print logs
  ),
  transports: [
    // Log to console
    new transports.Console(),

    // Log all errors to a dedicated file
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // Log all messages with level 'info' or lower (like 'warn' or 'error')
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "info",
    }),
  ],
});

export default logger;
