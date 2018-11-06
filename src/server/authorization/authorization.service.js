import Winston from '../../logging/app.logger';
import mongoose from 'mongoose';
import { User } from '../../data/schema/user';
import * as UserRegistration from '../../vivid/user-registrations/user-registrations.client';
import { prettyJson } from '../../logging/format';

/**
 * __Attempts to register a Zevere account with a Slack account.__
 * @param {string} zevereId The ID of a Zevere account.
 * @param {string} slackId The ID of a Slack account.
 * @returns {Promise<boolean>} A promise containing true if the user is registered successfully, or false if they were already registered before.
 */
export async function registerUser(zevereId: string, slackId: string): Promise<boolean> {
    try {
        const isRegistered = await userIsRegistered(slackId);
        if (isRegistered) {
            Winston.info(`Cannot register user. Account is already registered with Zevere. Zevere ID: '${zevereId}', Slack ID: '${slackId}'`);
            return false;
        }
        const registration = await UserRegistration.registerUser(zevereId, slackId);
        if (registration) {
            Winston.info('User was added to Vivid successfully. Attempting to save User in database.');
            await createAccount(zevereId, slackId);
            Winston.info(`Successfully registered User in both Vivid and Database. Zevere ID: '${zevereId}', Slack ID: '${slackId}'`);
        }
        return true;
    } catch (err) {
        throw err;
    }
}

/**
 * __Attempts to unregister a Zevere account from a Slack account.__
 * @param {string} slackId The ID of the user's Slack account.
 * @returns {Promise<boolean>} A promise containing true if the user was successfully unregistered, or false if they were already unregistered.
 */
export async function unregisterUser(slackId: string): Promise<boolean> {
    const isRegistered = await userIsRegistered(slackId);
    if (!isRegistered) {
        Winston.info(`Cannot unregister user. Account is not registered with Zevere. Slack ID: '${slackId}'`);
        return isRegistered;
    }

    const zevereId = await getUserBySlackId(slackId).zevereId;
    await UserRegistration.unregisterUserByUsername(zevereId);
    await removeAccount(slackId);
    return true;
}


/**
 * __Checks if user is registered on Vivid by scouring for a registration with Slack as well as checking the database.__
 *
 * @param {string} slackId The ID of a Slack account.
 * @returns {Promise<boolean>} A promise containing true if the user is registered with Slack, false if not.
 */
export async function userIsRegistered(slackId: string): Promise<boolean> {
    let zevereId; 
    try {
        const user = await getUserBySlackId(slackId);
        zevereId = user.zevereId;
    } catch (err) {
        Winston.error('Could not get user by Slack ID. Slack ID: ' + slackId);
        Winston.error(JSON.stringify(err));
    }
    
    if (!zevereId) {
        Winston.info(`User not found in database. Slack ID: '${slackId}'`);
        return false;
    }

    try {
        const acc = await UserRegistration.getUserRegistrationsByUsername(zevereId);
        Winston.info('Got registrations for: ' + acc.username);
        acc.registrations |> prettyJson |> Winston.info;

        for(const reg of acc.registrations) {
            if (reg.platform.toLowerCase() === 'slack') {
                return true;
            }
        }
    } catch (err) {
        err |> prettyJson |> Winston.error;
    }

    Winston.info(`No registrations found for '${slackId}' in Vivid.`);
    return false;
}


/**
 * __Attempts to save a link a Zevere account to a Slack account.__
 * @param {string} zevereId The ID of a Zevere account.
 * @param {string} slackId The ID of a Slack account.
 * @throws Error when there is an issue creating the document in the database.
 */
async function createAccount(zevereId: string, slackId: string): Promise<void> {
    const UserModel = mongoose.model('User');
    const user = new User();
    user.zevereId = zevereId;
    user.slackId = slackId;

    Winston.info('Linking accounts:');
    Winston.info(`\tZevere ID: ${zevereId}`);
    Winston.info(`\tSlack ID: ${slackId}`);

    await UserModel.create(user);
}

async function removeAccount(slackId: string): Promise<void> {
    const UserModel = mongoose.model('User');
    Winston.info('Removing account:');
    Winston.info(`\tSlack ID: ${slackId}`);

    await UserModel.deleteOne({ slackId });    
}

export async function getUserBySlackId(slackId: string): Promise<User> {
    const UserModel = mongoose.model('User');
    const userModel = await UserModel.findOne({ slackId });
    return userModel;
}
