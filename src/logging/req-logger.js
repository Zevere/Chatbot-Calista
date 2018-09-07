import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, '..', '..', 'logs', 'morgan');

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

