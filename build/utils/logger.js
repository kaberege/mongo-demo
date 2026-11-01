import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";
import { NODE_ENV, LOG_LEVEL } from "./config.js";
// Ensure the logs directory exists before creating the logger
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const logFormat = format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.errors({ stack: true }), format.splat(), format.json());
export const logger = createLogger({
    level: LOG_LEVEL || "info",
    format: logFormat,
    defaultMeta: { service: "api-service" },
    transports: [
        new transports.File({
            filename: path.join("logs", "error.log"),
            level: "error",
        }),
        new transports.File({
            filename: path.join("logs", "combined.log"),
        }),
    ],
});
if (NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.combine(format.colorize(), format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
        })),
    }));
}
//# sourceMappingURL=logger.js.map