import tutorial from './client/messaging';
import dotenv from 'dotenv';
import buildServer from './server';
import morgan from 'morgan';
import http from 'http';
import Winston from './logging/app.logger';
import { prettyJson } from './logging/format';

/**
 * Application Entry Point
 */
(async function main() {
    try {
        dotenv.load();
        const server = http.createServer(await buildServer());
        server.on('listening', () => {
            Winston.info("Server started.");
            server.address() |> JSON.stringify |> Winston.info;
        });
        server.on("error", (err) => {
            err |> JSON.stringify |> Winston.error;
        });
        server.listen(process.env.PORT || 8080);
    }
    catch (exception) {
        exception |> prettyJson |> Winston.error;
        throw exception;
    }
})();