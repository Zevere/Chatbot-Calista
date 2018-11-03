import 'winston-daily-rotate-file';

import path from 'path';
import winston from 'winston';
import resolveLogDirectory from './path-resolver';


const logDir = resolveLogDirectory('app');

function resolveLogLevel(): string {
    if (process.env.NODE_ENV === 'development') {
        return 'silly';
    }

    return 'info';
}

const consoleLogLevel = resolveLogLevel();

const consoleLog = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
    ),
    level: consoleLogLevel,
});

const rotatingInfoLog = new winston.transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD-HH',
    dirname: path.join(logDir, 'info'),
    filename: 'info-%DATE%.log',
    format: winston.format.json(),
    level: 'info',
    maxFiles: '365d',
    maxSize: '1440m',
    zippedArchive: false,
});

const rotatingErrorLog = new winston.transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD-HH',
    dirname: path.join(logDir, 'error'),
    filename: 'error-%DATE%.log',
    format: winston.format.json(),
    level: 'error',
    maxFiles: '365d',
    maxSize: '1440m',
    zippedArchive: false,
});

const logger = winston.createLogger({
    transports: [
        consoleLog,
        rotatingInfoLog,
        rotatingErrorLog
    ]
});

/** 
 * __A Winston logger which logs to multiple transports based off of the
 * log level. File logs are separated into info and error and logged in a JSON format,
 * whereas console logs depend on the NODE_ENV and provide a simplified view of each log.__
 * 
 * @see https://github.com/winstonjs/winston/blob/master/docs/transports.md
 * @returns {winston.Logger} A Winston logger.
*/
export default logger;
