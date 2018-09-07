import winston from 'winston';
import path from 'path';

import 'winston-daily-rotate-file';

const consoleLog = new winston.transports.Console({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
    )
});

const rotatingInfoLog = new winston.transports.DailyRotateFile({
    filename: 'info-%DATE%.log',
    dirname: path.join(__dirname, '..', '..', 'logs', 'winston', 'info'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '1440m',
    maxFiles: '365d',
    level: 'info',
    format: winston.format.json()
});

const rotatingErrorLog = new winston.transports.DailyRotateFile({
    filename: 'error-%DATE%.log',
    dirname: path.join(__dirname, '..', '..', 'logs', 'winston', 'error'),
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


module.exports = winston.createLogger({
    level: 'info',
    transports: [
        consoleLog,
        rotatingInfoLog,
        rotatingErrorLog
    ]
});