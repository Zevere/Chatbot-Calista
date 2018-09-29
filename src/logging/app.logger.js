import winston from 'winston';
import path from 'path';

import 'winston-daily-rotate-file';

const logDir = process.env.APP_LOGS ? 
    path.join(process.env.APP_LOGS, 'app')
    : path.join(__dirname, '..', '..', 'logs', 'app');

const consoleLog = new winston.transports.Console({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
    )
});

const rotatingInfoLog = new winston.transports.DailyRotateFile({
    filename: 'info-%DATE%.log',
    dirname: path.join(logDir, 'info'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '1440m',
    maxFiles: '365d',
    level: 'info',
    format: winston.format.json()
});

const rotatingErrorLog = new winston.transports.DailyRotateFile({
    filename: 'error-%DATE%.log',
    dirname: path.join(logDir, 'error'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '1440m',
    maxFiles: '365d',
    level: 'error',
    format: winston.format.json()
});

rotatingInfoLog.on('rotate', function (oldFileName, newFileName) {
    // TODO: Possibly send to DB
});

const logger: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        consoleLog,
        rotatingInfoLog,
        rotatingErrorLog
    ]
});
export default logger;