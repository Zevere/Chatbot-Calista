import { messageUser } from '../../slack/messaging';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../logging/app.logger';
import { prettyJson } from '../../logging/format';
import slackClient from '../../slack';
import { userIsRegistered } from './authorization.service';
import * as crypto from 'crypto';
import * as qs from 'qs';

export async function validateUser(req: Request, res: Response, next: NextFunction) {
    const client = slackClient();
    try {
        //res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
        req.body |> prettyJson |> Winston.info;
        const {
            user_id
        } = req.body;

        if (await userIsRegistered(user_id)) {
            next();
        } else {
            next(Error('User not authenticated.'));
            messageUser(client, user_id, 'Oops! Seems like you are not logged in yet. Try using /login first!');
        }


    }
    catch (exception) {
        Winston.error('Exception in validateUser');
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}

/**
 * Validate that requests are coming from Slack using the Slack Signing Secret.
 */
export async function validateSlack(req: Request, res: Response, next: NextFunction) {
    // Code Credits: https://medium.com/@rajat_sriv/verifying-requests-from-slack-using-node-js-69a8b771b704   
    const timestamp = req.header('X-Slack-Request-Timestamp');
    const slackSignature = req.header('X-Slack-Signature');
    const body = qs.stringify(req.body, { format: 'RFC1738' });

    if (!timestamp) {
        Winston.error('Received a request without the X-Slack-Request-Timestamp header.');
        throw Error('Received Slack request without a timestamp.');
    }

    // convert current time from milliseconds to seconds
    const time = Math.floor(new Date().getTime() / 1000);
    if (Math.abs(time - timestamp) > 300) {
        Winston.error('Received a request with a timestamp older than 300 seconds. Possible replay attack.');
        return res.status(400).send('Verification failed');
    }

    const sigBasestring = `v0:${timestamp}:${body}`;

    const mySignature = 'v0=' + crypto
        .createHmac('sha256', process.env.SIGNING_SECRET)
        .update(sigBasestring, 'utf8')
        .digest('hex');

    if (crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(slackSignature, 'utf8'))) {
        Winston.debug('Message confirmed as coming from Slack.');
        next();
    } else {
        Winston.error('Received a request with an invalid signature.');
        return res.status(400).send('Verification failed');
    }
}
