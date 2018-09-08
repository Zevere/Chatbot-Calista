import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import requestLogger from './logging/req-logger';

const app = express();

app.use(requestLogger)
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(function (req, res, next) {
        // catch 404 and forward to error handler
        next(createError(404));
    });

export default app;
