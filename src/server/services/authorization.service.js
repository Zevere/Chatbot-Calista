import Winston from '../../logging/app.logger';
import mongoose from 'mongoose';
import { User } from '../../data/schema/user';

/**
 * __Attempts to link a Zevere account to a Slack account.__
 * @param {string} zevereId The ID of a Zevere account.
 * @param {string} slackId The ID of a Slack account.
 * @throws Error when there is an issue creating the document in the database.
 * @returns {Promise<boolean>} A promise containing true if the account is linked, or false if it already exists.
 */
export async function linkAccounts(zevereId: string, slackId: string) {
    const user = new User();
    user.zevereId = zevereId;
    user.slackId = slackId;

    if (await userExists(user)) {
        Winston.info('Account already exists');
        return false;
    }

    const UserModel = mongoose.model('User');
    Winston.info('Linking accounts:');
    Winston.info(`\tZevere ID: ${zevereId}`);
    Winston.info(`\tSlack ID: ${slackId}`);

    await UserModel.create(user);
    return true;
}


async function findFirstUser(user: User) {  // eslint-disable-line no-unused-vars
    const UserModel = mongoose.model('User');
    let users = await UserModel.find(user);
    if (users.length <= 0) {
        return null;
    }
    return users[0];
}

async function userExists(user: User) {
    const UserModel = mongoose.model('User');
    const users = await UserModel.find().or([{ slackId: user.slackId }, { zevereId: user.zevereId }]);
    return users.length > 0;
}
