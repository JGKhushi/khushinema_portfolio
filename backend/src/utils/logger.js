const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const stamp = () => new Date().toISOString().slice(11, 19);

const write = (stream, color, label, args) => {
  stream(`${COLORS.dim}${stamp()}${COLORS.reset} ${color}${label}${COLORS.reset}`, ...args);
};

export const logger = {
  info: (...args) => write(console.log, COLORS.cyan, 'info ', args),
  success: (...args) => write(console.log, COLORS.green, 'ready', args),
  warn: (...args) => write(console.warn, COLORS.yellow, 'warn ', args),
  error: (...args) => write(console.error, COLORS.red, 'error', args),
};

export default logger;
