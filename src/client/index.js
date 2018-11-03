import { WebClient } from '@slack/client';

// ES6 export default buildSlackClient doesn't work...
/**
 * __Creates an instance of the Slack Web Client using the
 * ZEVERE_SLACK_TOKEN, CLIENT_ID, and CLIENT_SECRET environment
 * variables.__
 * @returns {WebClient}
 */
export function slackClient(): WebClient {
    const token = process.env.ZEVERE_SLACK_TOKEN?.trim();
    const web = new WebClient(token, {
        clientId: process.env.CLIENT_ID?.trim(),
        clientSecret: process.env.CLIENT_SECRET?.trim()
    });
    return web;
}
