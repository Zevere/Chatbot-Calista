import * as path from 'path';

import { NextFunction, Request, Response } from 'express';

import Winston from '../../logging/app.logger';
import mongoose from 'mongoose';

import { User } from '../data/schema/user';
import { prettyJson } from '../../logging/format';


export async function redirectPageHandler(req: Request, res: Response, next: NextFunction) {
    const UserModel = mongoose.model('User');
    const root = path.join(__dirname, 'views');

    req.body |> prettyJson |> Winston.info;
    
    res.status(200)
        .sendFile('redirect.html', {
            root: root
        }, function (err) {
            if (err) {
                next(err);
            }
        });

    // Should come from the web app
    let zevereId: string = req.query['zv-user'];

    // Set from client/messaging/loginPrompt, sent to web app, and back here again
    let slackId: string = req.query['id'];

    if (!zevereId || !slackId) {
        return;    
    }

    const user = new User();
    user.zevereId = zevereId;
    user.userId = slackId;

    try {
        await UserModel.create(user);
        Winston.info(`Successfully connected Slack Account: "${slackId}" with Zevere Account: "${zevereId}"`);
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
    }

}
