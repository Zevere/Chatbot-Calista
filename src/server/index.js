import express from 'express';
import { json } from 'express';

import reqLogger from '../logging/req.logger';
import apiRouter from './api';
import Winston from '../logging/app.logger';


function buildServer() {
    const app = express();
    app.use(json());
    app.use(reqLogger);
    app.get('/', (req, res) => {res.send('OK.')});
    app.use(`/slack/api/v${process.env.API_VERSION_NUMBER || 1}`, apiRouter);
    app.use(errorHandler);

    return app;
};

function errorHandler(err, req, res, next) {
    return res.status(404).send({
        error: process.env.NODE_ENV === 'development' ? err.message : 'There was an error processing your request.'
    });
}

export default buildServer();