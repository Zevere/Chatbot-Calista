import client from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';

export async function messageHome(req: Request, res: Response, next: NextFunction) {
    Winston.info('Request received for: ' + req.url);
    req.body |> JSON.stringify |> Winston.info;
    Messaging.messageGeneralChat(client);
}