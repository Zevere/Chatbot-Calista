import { slackClient } from '../../../client';
import * as Messaging from '../../../client/messaging';
import { Request, Response, NextFunction } from 'express';
import Winston from '../../../logging/app.logger';
import { WebClient } from '@slack/client';
import { prettyJson } from '../../../logging/format';
import dbconnection from '../../data/mongoose';
import mongoose from 'mongoose';

export async function messageGeneralChat(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
    req.body |> prettyJson |> Winston.info;

    let conn = await dbconnection();
    const s = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });
    const a = conn.model<Schema>("message", s);
    const M = conn.model('message', s);
    const requestBodyModel = new M(req.body);
    //requestBodyModel.mixed = req.body;
    requestBodyModel.save((err, _) => {
        Winston.error('Could not save the message!');
        err |> prettyJson |> Winston.error;
    });
    try {
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