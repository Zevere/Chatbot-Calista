import { WebClient } from '@slack/client';

/**
 * __Creates an instance of the Slack Web Client using the
 * ZEVERE_SLACK_TOKEN, CLIENT_ID, and CLIENT_SECRET environment
 * variables.__
 * @returns {WebClient}
 */
export class SlackClient extends WebClient {

    constructor() {
        super(
            process.env.ZEVERE_SLACK_TOKEN?.trim(),
            {
                clientId: process.env.CLIENT_ID?.trim(),
                clientSecret: process.env.CLIENT_SECRET?.trim()
            }
        );
    }
}

/**
 * Tests if you are able to access the API.
 *
 * @param {WebClient} client
 */
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

export default SlackClient;
