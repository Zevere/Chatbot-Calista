import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import slackClient from '../../../slack';
import { prettyJson } from '../../../logging/format';
import { getUserProfileByUsername } from '../../../vivid/profile/profile.client';
import { getUserBySlackId } from '../../authorization/authorization.service';
import { messageUser } from '../../../slack/messaging';
import { UserProfile } from '../../../vivid/profile/user-profile.model';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const client = slackClient();
    try {
        res.status(200).send('Fetching your profile...');
        req.body |> prettyJson |> Winston.info;
        const {
            user_id
        } = req.body;
        const user = await getUserBySlackId(user_id);
        const profile = await getUserProfileByUsername(user.zevereId);
        return await messageUser(client, user_id, formatProfile(profile));
    } catch (err) {
        err |> prettyJson |> Winston.error;
        next(err);
    }
}

function formatProfile(userProfile: UserProfile) {
    let profile = '';
    for(const prop in userProfile) {
        profile += `${prop}: ${userProfile[prop]}\n`;
    }
    return profile;
}
