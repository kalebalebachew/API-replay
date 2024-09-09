import winston from "winston";
import path from "path";

const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, errors } = format;


const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]  ${stack || message}`;
});

const logger = createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    winstonFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/error.log",
      level: "error", 
    }),
  ],
});

export default logger;
