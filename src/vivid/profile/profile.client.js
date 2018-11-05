// @flow
import { AxiosResponse } from 'axios';
import { axiosForVivid } from '../../config/axios';
import { UserProfile } from './user-profile.model';
import Winston from '../../logging/app.logger';
import { prettyJson } from '../../logging/format';
import { VividError } from '../vivid-error.model';

const basePath = '/api/v1/operations/getUserProfile';

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



