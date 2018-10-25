import * as Messaging from '../../../client/messaging';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { slackClient } from '../../../client';

export async function login(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> prettyJson |> Winston.info;
    const {
        user_id
    } = req.body;
    try {
        await Messaging.loginPrompt(slackClient(), user_id);
    }
    catch (exception) {
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
