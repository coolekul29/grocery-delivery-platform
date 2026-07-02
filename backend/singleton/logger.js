class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    Logger.instance = this;
  }

  log(action, message) {
    const logEntry = {
      action,
      message,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);

    console.log(`[${logEntry.timestamp}] ${action}: ${message}`);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();

module.exports = logger;