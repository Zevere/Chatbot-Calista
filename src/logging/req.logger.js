import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';

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

module.exports = morgan(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined', {
        stream: requestLogStream
    });

