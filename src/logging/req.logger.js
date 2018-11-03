import { RequestHandler } from 'express';

import fs from 'fs';
import morgan from 'morgan';
import resolveLogDirectory from './path-resolver';
import rfs from 'rotating-file-stream';


const logDirectory = resolveLogDirectory('requests');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const requestLogStream = rfs('req.log', {
    interval: '1d',
    path: logDirectory
});

/**
 * Logs requests to the file system. This uses
 * daily log rotation.
 */
export const fsReqLogger: RequestHandler = morgan(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined', {
        stream: requestLogStream
    });

/**
 * Logs requests to the console.
 */
export const consoleReqLogger: RequestHandler = morgan(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined'
);

export default fsReqLogger;
