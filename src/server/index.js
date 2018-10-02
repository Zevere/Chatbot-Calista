import express from 'express';

import reqLogger from '../logging/req.logger';
import apiRouter from './api';

function buildServer() {
    const app = express();
    app.use(express.json());
    app.use(reqLogger);
    app.use('/', apiRouter);
    app.use(errorHandler);
    return app;
};

function errorHandler(err, req, res, next) {
    return res.status(404).send({
        error: process.env.NODE_ENV === 'development' ? err.message : 'There was an error processing your request.'
    });
}

export default buildServer();