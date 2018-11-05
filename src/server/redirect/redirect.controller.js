import * as path from 'path';

import { NextFunction, Request, Response } from 'express';

import Winston from '../../logging/app.logger';

import { prettyJson } from '../../logging/format';
import { linkAccounts } from '../authorization/authorization.service';

export async function redirectPageHandler(req: Request, res: Response, next: NextFunction) {
    const root = path.join(__dirname, 'views');
    try {
        res.status(200)
            .sendFile('redirect.html', {
                root: root
            }, async function (err) {
                if (err) {
                    next(err);
                    return;
                }
                // Should come from the web app
                const zid = req.query['zv-user'];

                // Set from slack/messaging/loginPrompt, sent to web app, and back here again
                const sid = req.query['id'];

                if (!zid || !sid) {
                    return;
                }
                const res = await linkAccounts(zid, sid);
                if (res) {
                    Winston.info(`Successfully connected Slack Account: "${sid}" with Zevere Account: "${zid}"`);
                } else {
                    Winston.info('Account was already linked.');
                }
            });
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
    }
}
