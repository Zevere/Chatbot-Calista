import tutorial from './client/messaging';
import dotenv from 'dotenv';
import app from './server';
import morgan from 'morgan';
import http from 'http';
import Winston from './logging/app.logger';

/**
 * Application Entry Point
 */
(function main() {
    dotenv.load();
    const server = http.createServer(app);
    server.on('listening', () => {
        Winston.info("Server started.");
        server.address() |> JSON.stringify |> Winston.info;
    });
    server.on("error", (err) => {
        err |> JSON.stringify |> Winston.error;
    });
    server.listen(process.env.PORT || 8080);
})();