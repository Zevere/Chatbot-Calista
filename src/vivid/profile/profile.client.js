// @flow
import { AxiosResponse } from 'axios';
import { axiosForVivid } from '../../config/axios';
import { UserProfile } from './user-profile.model';
import Winston from '../../logging/app.logger';
import { prettyJson } from '../../logging/format';
import { VividError } from '../vivid-error.model';

const basePath = '/api/v1/operations/getUserProfile';

/**
 * Gets a User's profile based off of their Zevere Username.
 * Helpful for retrieving their name and the date they joined.
 * @export
 * @param {string} zevereUsername The User's Zevere username.
 * @returns {Promise<UserProfile>} A promise containing the User's profile.
 */
export async function getUserProfileByUsername(zevereUsername: string): Promise<UserProfile> {
    const axios = axiosForVivid();
    const url = `${basePath}?username=${zevereUsername}`;
    const response: AxiosResponse<UserProfile | VividError> = await axios.get(url);
    if (response.status !== 200) {
        const err = response.data;
        Winston.error(`Could not get User Profile. Zevere Username: '${zevereUsername}'`);
        err |> prettyJson |> Winston.error;
        throw Error(err);
    }
    return response.data;
}



