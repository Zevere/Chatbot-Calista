import 'winston-daily-rotate-file';

import path from 'path';
import winston from 'winston';


const logDir = process.env.APP_LOGS ? 
    path.join(process.env.APP_LOGS, 'app')
    : path.join(__dirname, '..', '..', 'logs', 'app');

const consoleLog = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
    ),
    level: 'info',
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

const logger: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        consoleLog,
        rotatingInfoLog,
        rotatingErrorLog
    ]
});

export default logger;
