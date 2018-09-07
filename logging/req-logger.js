const logger = require('morgan');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs', 'morgan');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const requestLogStream = rfs('req.log', {
    interval: '1d',
    path: logDirectory
});

module.exports = logger(
    process.env.NODE_ENV === 'development' ?
        'dev' : 'combined', {
        stream: requestLogStream
    });

