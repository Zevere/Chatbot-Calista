import Axios from 'axios';

export function axiosForVivid() {
    const axios = Axios.create({
        baseURL: process.env.VIVID_URL,
    });
    axios.defaults.auth.username = process.env.VIVID_USERNAME;
    axios.defaults.auth.password = process.env.VIVID_PASSWORD;
    return axios;
}

