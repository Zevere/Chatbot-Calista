import dotenv from 'dotenv';
import buildServer from './server';
import http from 'http';
import Winston from './logging/app.logger';
import { prettyJson } from './logging/format';
import dbconnection from './server/data/mongoose';

/**
 * Application Entry Point
 */
(async function main() {
    try {
        dotenv.load();
        await dbconnection();
        const server = http.createServer(buildServer());
        server.on('listening', () => {
            Winston.info('Server started.');
            server.address() |> JSON.stringify |> Winston.info;
        });
        server.on('error', (err) => {
            err |> JSON.stringify |> Winston.error;
        });
        server.listen(process.env.PORT || 8080);
    }
    catch (exception) {
        exception |> prettyJson |> Winston.error;
        throw exception;
    }
})();