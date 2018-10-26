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
                return next(err);
            }
            
            
            // Should come from the web app
            const zid = req.query['zv-user'];
            
            // Set from client/messaging/loginPrompt, sent to web app, and back here again
            const sid = req.query['id'];
            
            if (!zid || !sid) {
                return;
            }
            
            Winston.info('Linking accounts:');
            Winston.info(`\tZevere ID: ${zid}`);
            Winston.info(`\tSlack ID: ${sid}`);
            const user = new User();
            user.zevereId = zid;
            user.slackId = sid;

            UserModel.create(user).then(() => {
                Winston.info(`Successfully connected Slack Account: "${user.slackId}" with Zevere Account: "${user.zevereId}"`);
            }).catch (exception => {
                exception |> prettyJson |> Winston.error;
                next(exception);
            });
        });
}
