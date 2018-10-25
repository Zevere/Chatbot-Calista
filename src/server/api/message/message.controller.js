import { slackClient } from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';
import { WebClient } from '@slack/client';
import { prettyJson } from '../../../logging/format';
import mongoose from 'mongoose';

export async function messageGeneralChat(req: Request, res: Response, next: NextFunction) {
    const MessageRequest = mongoose.model('MessageRequest');
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> prettyJson |> Winston.info;
    try {
        const result = await MessageRequest.create(req.body);
        Winston.info('Message Saved');
        result |> prettyJson |> Winston.info;
        await Messaging.messageGeneralChat(slackClient(), req.body.text);
    }
    catch (exception) {
        exception |> prettyJson |> Winston.error;
    }
}

export async function messageSelf(req: Request, res: Response, next: NextFunction) {
    res.status(200).send();
    req.body |> prettyJson |> Winston.info;
    const {
        user_id,
        text
    } = req.body;

    try {
        await Messaging.messageUser(slackClient(), user_id, text);
    }
    catch (exception) {
        exception |> prettyJson |> Winston.error;
    }
}