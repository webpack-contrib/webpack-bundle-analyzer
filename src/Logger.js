const LEVELS = [
  'debug',
  'info',
  'warn',
  'error',
  'silent'
];

const loggerMethods = [
  'log',
  'trace',
  'group',
  'groupEnd',
  'groupEndCollapsed',
  'status',
  'clear',
  'profile'
];

const LEVEL_TO_CONSOLE_METHOD = new Map([
  ['debug', 'log'],
  ['info', 'log'],
  ['warn', 'log']
]);

const webpackLogger = require('webpack/lib/logging/runtime');

if (webpackLogger.getLogger) LEVELS.push(...loggerMethods);

class Logger {
  static levels = LEVELS;
  static defaultLevel = 'info';

  constructor(level = Logger.defaultLevel) {
    this.activeLevels = new Set();
    this.setLogLevel(level);
  }

  setLogLevel(level) {
    const levelIndex = LEVELS.indexOf(level);

    if (levelIndex === -1) throw new Error(`Invalid log level "${level}". Use one of these: ${LEVELS.join(', ')}`);

    this.activeLevels.clear();

    for (const [i, level] of LEVELS.entries()) {
      if (i >= levelIndex) this.activeLevels.add(level);
    }
  }

  _log(level, ...args) {
    if (webpackLogger.getLogger) {
      webpackLogger.getLogger('webpack-bundle-analyzer')[level](...args);
    } else {
      console[LEVEL_TO_CONSOLE_METHOD.get(level) || level](...args);
    }
  }

};

LEVELS.forEach(level => {
  if (level === 'silent') return;

  Logger.prototype[level] = function (...args) {
    if (this.activeLevels.has(level)) this._log(level, ...args);
  };
});

module.exports = Logger;
