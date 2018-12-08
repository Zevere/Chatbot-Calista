// @flow
import { AxiosResponse } from 'axios';
import { axiosForVivid } from '../../config/axios';
import Winston from '../../logging/app.logger';
import { prettyJson } from '../../logging/format';
import { UserRegistrationsResponse } from './user-registrations-response.model';
import { VividError } from '../vivid-error.model';
import { NewUserRegistration } from './new-user-registration.model';
import { UserRegistration } from './user-registration.model';

const basePath = '/api/v1/user-registrations';

/** 
 * __Get registrations for a Zevere user.__
 * 
 * [GET]
 * /api/v1/user-registrations/{username}
 * 
 * @param username The username of the Zevere User
 * @throws When there are no registrations found or if the ID is invalid.
*/
export async function getUserRegistrationsByUsername(username: string): Promise<UserRegistrationsResponse> {
    const axios = axiosForVivid();
    const url = `${basePath}/${username}`;
    const response: AxiosResponse<UserRegistrationsResponse | VividError> = await axios.get(url);
    if (response.status !== 200) {
        Winston.error('Could not get user registrations for: ' + username);
        response.data |> prettyJson |> Winston.error;
        throw Error(response.data);
    }
    return response.data;
}

/** 
 * __Unregister a Zevere user from Slack.__
 * 
 * [DELETE]
 * /api/v1/user-registrations/{username}
 * 
 * @param username The username of the Zevere User
*/
export async function unregisterUserByUsername(username: string): Promise<boolean> {
    const axios = axiosForVivid();
    const url = `${basePath}/${username}`;
    const response: AxiosResponse<?VividError> = await axios.delete(url);
    if (response.status !== 204) {
        const err = response.data;
        Winston.error('Could not unregister user: ' + username);
        err |> prettyJson |> Winston.error;
        return false;
    }
    return true;
}

/** 
 * __Register a Slack user with their Zevere account.__
 * 
 * [POST]
 * /api/v1/user-registrations
 * 
 * @param zevereUsername The Username of the user's Zevere account
 * @param slackId The ID of the user in Slack
*/

export async function registerUser(zevereUsername: string, slackId: string): Promise<UserRegistration> {
    Winston.info(`Attempting to register user on Vivid. Slack ID: '${slackId}', Zevere ID: '${zevereUsername}'`);
    const axios = axiosForVivid();
    const newUserRegistration: NewUserRegistration = {
        username: zevereUsername,
        chatUserId: slackId,
    };
    try {
        const response = await axios.post(basePath, newUserRegistration);
    
        if (response.status !== 201) {
            const err = response.data;
            Winston.error(`Could not register user on Vivid. Slack ID: '${slackId}', Zevere ID: '${zevereUsername}'`);
            err |> prettyJson |> Winston.error;
            throw Error(err);
        }
        Winston.info(`Successfully registered user on Vivid. Slack ID: '${slackId}', Zevere ID: '${zevereUsername}'`);
        return response.data;
    } catch (err) {
        throw err;
    }
}
