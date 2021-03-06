import Axios from 'axios';

export function axiosForVivid() {
    const axios = Axios.create({
        baseURL: process.env.VIVID_URL,
    });
    axios.defaults.auth = {
        password: process.env.VIVID_PASSWORD,
        username: process.env.VIVID_USERNAME,
    };

    axios.defaults.headers['Content-Type'] = 'application/json';
    return axios;
}

export function axiosForBorzoo() {
    const axios = Axios.create({
        baseURL: process.env.BORZOO_URL + '/zv/graphql',
    });

    axios.defaults.headers['Content-Type'] = 'application/json';
    return axios;
}
