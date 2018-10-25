import * as path from 'path';

import { consoleReqLogger, fsReqLogger } from '../logging/req.logger';
import { json, urlencoded } from 'express';

import Winston from '../logging/app.logger';
import apiRouter from './api';
import express from 'express';

import { prettyJson } from '../logging/format';



function buildServer(): express.Express {
    const app = express();
    app.use(consoleReqLogger);
    app.use(fsReqLogger);
    app.use(json());
    app.use(urlencoded());
    app.get('/', redirectPageHandler);
    app.post('/', redirectPageHandler);
    app.use(`/slack/api/v${process.env.API_VERSION_NUMBER || 1}`, apiRouter);
    app.use(errorHandler);

    return app;
}

function redirectPageHandler(req, res, next) {
    const root = path.join(__dirname, 'views');
    root |> Winston.info;
    res.status(200)
        .sendFile('redirect.html', {
            root: root
        }, function (err) {
            if (err) {
                next(err);
            }
        });
}

function errorHandler(err, req, res) {
    err |> prettyJson |> Winston.error;
    return res.status(404).send({
        error: process.env.NODE_ENV !== 'development' ? err.message : 'There was an error processing your request.'
    });
}

export default buildServer;
