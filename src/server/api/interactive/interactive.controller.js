import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';


export async function handleInteractiveRequest(req: Request, res: Response, next: NextFunction) {
    // TODO
    // 1. check the callback_ids
    // 2. assign to correct borzoo func
    try {
        res.status(200).send();
        const client = new SlackClient();
        req.body |> prettyJson |> Winston.debug;
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
