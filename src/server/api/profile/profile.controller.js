import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { SlackClient } from '../../../slack';
import { prettyJson } from '../../../logging/format';
import { getUserProfileByUsername } from '../../../vivid/profile/profile.client';
import { getUserBySlackId } from '../../authorization/authorization.service';
import { messageUserEphemeral } from '../../../slack/messaging';
import { UserProfile } from '../../../vivid/profile/user-profile.model';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const client = new SlackClient();
    try {
        res.status(200).send('Fetching your profile...');
        req.body |> prettyJson |> Winston.debug;
        const {
            user_id,
            channel_id
        } = req.body;
        const user = await getUserBySlackId(user_id);
        const profile = await getUserProfileByUsername(user.zevereId);
        return await messageUserEphemeral(client, user_id, channel_id,formatProfile(profile));
    } catch (err) {
        err |> prettyJson |> Winston.error;
        next(err);
    }
}

function formatProfile(userProfile: UserProfile) {
    let profile = '';
    profile += `Zevere ID: \`${userProfile.id}\`\n`;
    profile += `First Name: ${userProfile.firstName}\n`;
    profile += `Last Name: ${userProfile.lastName}\n`;
    profile += `Joined On: ${userProfile.joinedAt.substr(0, 10)}\n`;
    return profile;
}
