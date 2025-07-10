/**
 * LOGGER ESTRUCTURADO
 * 
 * Utilidad para logging consistente en toda la aplicación
 */

const logLevels = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
};

const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  
  return JSON.stringify(logEntry);
};

export const logger = {
  error: (message, data = null) => {
    console.error(formatMessage(logLevels.ERROR, message, data));
  },
  
  warn: (message, data = null) => {
    console.warn(formatMessage(logLevels.WARN, message, data));
  },
  
  info: (message, data = null) => {
    console.log(formatMessage(logLevels.INFO, message, data));
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage(logLevels.DEBUG, message, data));
    }
  }
};

export default logger; 