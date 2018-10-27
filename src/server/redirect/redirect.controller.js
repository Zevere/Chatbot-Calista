import * as path from 'path';

import { NextFunction, Request, Response } from 'express';

import Winston from '../../logging/app.logger';

import { prettyJson } from '../../logging/format';
import { linkAccounts } from '../services/authorization.service';

export async function redirectPageHandler(req: Request, res: Response, next: NextFunction) {
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

            linkAccounts(zid, sid).then((res) => {
                if(res) {
                    Winston.info(`Successfully connected Slack Account: "${sid}" with Zevere Account: "${zid}"`);
                } else {
                    Winston.info('Account was already linked.');
                }
            }).catch(exception => {
                exception |> prettyJson |> Winston.error;
                next(exception);
            });
        });
}
