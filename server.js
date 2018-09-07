const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const requestLogger = require('./logging/req-logger');

const app = express();

app.use(requestLogger)
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(function (req, res, next) {
        // catch 404 and forward to error handler
        next(createError(404));
    });

module.exports = app;
