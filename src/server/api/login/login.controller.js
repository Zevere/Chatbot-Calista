import { loginPrompt, messageUser } from '../../../slack/messaging';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import slackClient from '../../../slack';
import { userIsRegistered } from '../../authorization/authorization.service';


export async function promptLogin(req: Request, res: Response, next: NextFunction) {
    const client = slackClient();
    try {
        res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
        req.body |> prettyJson |> Winston.info;
        const {
            user_id
        } = req.body;

        if(await userIsRegistered(user_id)) {
            return await messageUser(client, user_id, 'You are already logged in.');
        }


        const url = `${req.protocol}://${req.get('host')}`;
        await loginPrompt(client, user_id, url);
    }
    catch (exception) {
        Winston.error('Exception in promptLogin');
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
