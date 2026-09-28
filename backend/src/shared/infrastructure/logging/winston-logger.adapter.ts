import { LoggerPort } from '@shared/application/ports/logger.port';
import { logger as winstonLogger } from './winston.logger';

export class WinstonLoggerAdapter implements LoggerPort {
  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, meta);
  }
}
