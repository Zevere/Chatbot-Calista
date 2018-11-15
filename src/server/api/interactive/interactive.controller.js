import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';


export async function handleInteractiveRequest(req: Request, res: Response, next: NextFunction) {
    // TODO
    // 1. check the callback_ids
    // 2. assign to correct borzoo func
    try {
        const client = new SlackClient();
        res.status(200).send();
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
