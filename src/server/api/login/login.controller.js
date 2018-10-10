import { slackClient } from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';
import { WebClient } from '@slack/client';
import { prettyJson } from '../../../logging/format';

export async function login(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> prettyJson |> Winston.debug;
    const {
        user_id
    } = req.body;
    await Messaging.loginPrompt(slackClient(), user_id);
}