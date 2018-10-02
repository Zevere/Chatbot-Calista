import { WebClient } from '@slack/client';

function buildSlackClient(): WebClient {
    const token = process.env.ZEVERE_SLACK_TOKEN;
    const web = new WebClient(token, {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });
    return web;
}

export default buildSlackClient();