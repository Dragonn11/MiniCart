export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface LogProvider {
  log(entry: LogEntry): void;
}

class ConsoleLogProvider implements LogProvider {
  log(entry: LogEntry): void {
    const method = entry.level === 'debug' ? 'log' : entry.level;
    console[method](
      `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`,
      entry.data ?? ''
    );
  }
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private provider: LogProvider = new ConsoleLogProvider();
  private minLevel: LogLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info';

  setProvider(provider: LogProvider): void {
    this.provider = provider;
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel];
  }

  private createEntry(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
    return { level, message, timestamp: new Date().toISOString(), data };
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) this.provider.log(this.createEntry('debug', message, data));
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('info')) this.provider.log(this.createEntry('info', message, data));
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) this.provider.log(this.createEntry('warn', message, data));
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('error')) this.provider.log(this.createEntry('error', message, data));
  }
}

export const logger = new Logger();
