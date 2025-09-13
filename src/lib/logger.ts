import { createLogger, format, type LoggerOptions, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const defaultConfig: LoggerOptions = {
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
    }),
  ],
};

const logger = createLogger({
  ...defaultConfig,
});

export const info = (message: string) => logger.info(message);

export const warn = (message: string) => logger.warn(message);

export const error = (message: string) => logger.error(message);

export default logger;
