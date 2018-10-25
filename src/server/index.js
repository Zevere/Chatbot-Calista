import * as path from 'path';

import express from 'express';
import { json, urlencoded } from 'express';

import { consoleReqLogger, fsReqLogger } from '../logging/req.logger';
import apiRouter from './api';
import Winston from '../logging/app.logger';


function buildServer(): express.Express {
    const app = express();
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(consoleReqLogger);
    app.use(fsReqLogger);
    app.use(json());
    app.use(urlencoded());
    app.get('/', (req, res) => { res.send('OK.') });
    app.use(`/slack/api/v${process.env.API_VERSION_NUMBER || 1}`, apiRouter);
    app.use(errorHandler);

    return app;
};

function errorHandler(err, req, res, next) {
    return res.status(404).send({
        error: process.env.NODE_ENV === 'development' ? err.message : 'There was an error processing your request.'
    });
}

export default buildServer;