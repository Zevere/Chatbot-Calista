import { slackClient } from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';
import { WebClient } from '@slack/client';

export async function login(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> JSON.stringify |> Winston.debug;
    
    await Messaging.messageGeneralChat(slackClient(), req.body.text);
}