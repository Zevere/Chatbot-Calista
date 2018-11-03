
import { Express, json, urlencoded } from 'express';
import { consoleReqLogger, fsReqLogger } from '../logging/req.logger';

import Winston from '../logging/app.logger';
import apiRouter from './api';
import express from 'express';

import { redirectPageHandler } from './redirect/redirect.controller';
import { validateSlack } from './authorization/authorization.middleware';

/**
 * Assigns middleware to an express server and returns it.
 * @returns {Express}
 */
function buildServer(): Express {
    const app = express();
    app.use(consoleReqLogger);
    app.use(fsReqLogger);
    app.use(json());
    app.use(urlencoded());
    app.get('/', redirectPageHandler);
    app.use(`/slack/api/v${process.env.API_VERSION_NUMBER || 1}`, validateSlack, apiRouter);
    app.use(errorHandler);

    return app;
}

function errorHandler(err, req, res) {
    if (!(err instanceof Error) && typeof(err) !== 'string') {
        Winston.debug(err);
        Winston.debug(req);
        Winston.debug(res);
        res = req;
        req = err;
        err = 'Invalid endpoint';
    }
    Winston.error('Error caught in final error handler.');
    Winston.error(err);
    //err |> prettyJson |> Winston.error;
    return res.status(404).send({
        error: process.env.NODE_ENV !== 'development' ? err.message : 'There was an error processing your request.'
    });
}

export default buildServer;
