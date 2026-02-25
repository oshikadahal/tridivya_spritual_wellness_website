import fs from 'fs';
import path from 'path';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };

    const logText = JSON.stringify(entry) + '\n';

    // Write to file
    fs.appendFileSync(this.logFile, logText);

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    this.writeLog('info', message, data);
  }

  warn(message: string, data?: any) {
    this.writeLog('warn', message, data);
  }

  error(message: string, data?: any) {
    this.writeLog('error', message, data);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog('debug', message, data);
    }
  }

  /**
   * Get recent logs
   */
  getRecentLogs(lines: number = 100): LogEntry[] {
    try {
      const content = fs.readFileSync(this.logFile, 'utf-8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines
        .slice(-lines)
        .map(line => {
          try {
            return JSON.parse(line) as LogEntry;
          } catch {
            return null;
          }
        })
        .filter((entry): entry is LogEntry => entry !== null);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    try {
      const content = fs.readFileSync(this.logFile, 'utf-8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter((entry): entry is LogEntry => entry !== null && entry.level === level);
    } catch (error) {
      return [];
    }
  }

  /**
   * Clear old logs
   */
  clearOldLogs(daysOld: number = 7) {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = new Date();

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stat = fs.statSync(filePath);
        const fileAge = (now.getTime() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (fileAge > daysOld) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      this.error('Failed to clear old logs', error);
    }
  }
}

export const logger = new Logger();
