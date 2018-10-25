import { RequestHandler } from 'express';

import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';

const logDirectory = process.env.APP_LOGS ?
    path.join(process.env.APP_LOGS, 'requests')
    : path.join(__dirname, '..', '..', 'logs', 'requests');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const requestLogStream = rfs('req.log', {
    interval: '1d',
    path: logDirectory
});

export const fsReqLogger: RequestHandler = morgan(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined', {
        stream: requestLogStream
    });

export const consoleReqLogger: RequestHandler = morgan(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined'
);

export default fsReqLogger;
