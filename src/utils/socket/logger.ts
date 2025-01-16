import { createLogger, format, transports } from "winston";
import path from "node:path";
import DailyRotateFile from "winston-daily-rotate-file";

const logsPath = path.resolve(process.cwd(), "logs");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        })
      ),
    }),
    new DailyRotateFile({
      dirname: "logs",
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "7d",
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logsPath, "rejections.log"),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logsPath, "rejections.log"),
    }),
  ],
});

export default logger;
