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


export async function findUserBySlackId(id: string) {
    const UserModel = mongoose.model('User');
    return await UserModel.findOne({slackId: id});
}

async function findFirstUser(user: User) {  // eslint-disable-line no-unused-vars
    const UserModel = mongoose.model('User');
    return await UserModel.findOne(user);
}


async function userExists(user: User) {
    const UserModel = mongoose.model('User');
    const u = await UserModel.findOne().or([{ slackId: user.slackId }, { zevereId: user.zevereId }]);
    return !!u;
}
