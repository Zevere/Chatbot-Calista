import { messageUserEphemeral } from '../../../slack/messaging';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';
import { unregisterUserByUsername } from '../../../vivid/user-registrations/user-registrations.client';
import { getUserBySlackId } from '../../authorization/authorization.service';

export async function disconnect(req: Request, res: Response, next: NextFunction) {
    const client = new SlackClient();
    try {
        res.status(200).send('Got it!'); // basic receipt: https://api.slack.com/slash-commands?#responding_basic_receipt
        req.body |> prettyJson |> Winston.debug;
        const {
            user_id,
            channel_id
        } = req.body; 
        const user = await getUserBySlackId(user_id);
        if(await unregisterUserByUsername(user.zevereId)) {
            await messageUserEphemeral(client, user_id, channel_id, 'You have successfully disconnected from Zevere.');
        } else {
            await messageUserEphemeral(client, user_id, channel_id, 'We were unable to disconnect you from Zevere. Please try again.');
        }
    }
    catch (exception) {
        Winston.error('Exception in #disconnect');
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
