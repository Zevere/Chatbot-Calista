import * as Messaging from '../../../slack/messaging';

import { NextFunction, Request, Response } from 'express';

import Winston from '../../../logging/app.logger';

import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';

export async function viewList(req: Request, res: Response, next: NextFunction) {
    res.status(200).send();
    const { user_id, channel_id } = req.body;
    req.body |> prettyJson |> Winston.info;
    try {
        await Messaging.showListsForSelection(new SlackClient(), user_id, channel_id);
    } catch (err) {
        err |> prettyJson |> Winston.error;
        next(err);
    }
}

export async function deleteList(req: Request, res: Response, next: NextFunction) {
    res.status(200).send();
    const { user_id, channel_id } = req.body;
    req.body |> prettyJson |> Winston.info;
    try {
        await Messaging.showListsForDeletion(new SlackClient(), user_id, channel_id);
    } catch (err) {
        err |> prettyJson |> Winston.error;
        next(err);
    }
}
