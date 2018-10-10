import { slackClient } from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';
import { WebClient } from '@slack/client';
import { prettyJson } from '../../../logging/format';
import dbconnection from '../../data/mongoose';
import { Schema, Model, model } from 'mongoose';

export async function messageGeneralChat(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> prettyJson |> Winston.info;
    const schema = new Schema({ any: Schema.Types.Mixed });
    const M = model('message', schema);
    const requestBodyModel = new M(req.body);
    requestBodyModel.save((err, _) => {
        err |> prettyJson |> Winston.error;
    });
    await Messaging.messageGeneralChat(slackClient(), req.body.text);
}

export async function messageSelf(req: Request, res: Response, next: NextFunction) {
    res.status(200).send();
    req.body |> prettyJson |> Winston.info;
    const {
        user_id,
        text
    } = req.body;
    await Messaging.messageUser(slackClient(), user_id, text);
}