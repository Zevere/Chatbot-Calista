import { WebClient } from '@slack/client';

// ES6 export default buildSlackClient doesn't work...
/**
 * __Creates an instance of the Slack Web Client using the
 * ZEVERE_SLACK_TOKEN, CLIENT_ID, and CLIENT_SECRET environment
 * variables.__
 * @returns {WebClient}
 */
export function slackClient(): Promise<WebClient> {
    const token = process.env.ZEVERE_SLACK_TOKEN?.trim();
    const id = process.env.CLIENT_ID?.trim();
    const secret = process.env.CLIENT_SECRET?.trim();

    const web = new WebClient(token, {
        clientId: id,
        clientSecret: secret
    });

    return web;
}

export async function testClient(client: WebClient) {
    try {
        const res = await client.auth.test();
        if (res.ok) {
            return true;
        } else {
            throw Error('Not authorized!');
        }
    } catch (err) {
        throw err;
    }
}

export default slackClient;
