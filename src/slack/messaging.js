import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';

/**
 * __Provides a Login button to the user.__
 * @param {WebClient} web The instance of the Slack WebClient.
 * @param {string} userId The Slack ID or Slack username of whom to send the message to.
 * @param {string} url The URL that you wish to redirect a user to after logging in.
 * @returns {Promise<WebAPICallResult>}
 */
export async function loginPrompt(web: WebClient, userId: string, url: string): Promise<WebAPICallResult> {
    try {
        let webAppUrl = process.env.ZEVERE_WEB_APP_URL + '/login';
        let redirectUrl = `${url}?id=${userId}`;
        webAppUrl = `${webAppUrl}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
        //url = url |> encodeURIComponent;
        return await web.chat.postMessage({
            attachments: [
                {
                    actions: [
                        {
                            text: 'Login',
                            type: 'button',
                            url: webAppUrl,
                        }
                    ],
                    fallback: `Click here to login: ${webAppUrl}`,
                    text:'Click here to login:',
                }
            ],
            channel: userId,
            text: 'Please login to Zevere.',
        });
    } catch (exception) {
        Winston.error('Exception caught in messaging#loginPrompt.');
        throw exception;
    }
}

/**
 * __Sends the supplied message to the #General channel.__
 * @param {WebClient} web The instance of the Slack Web Client.
 * @param {string} message The message you wish to send to #General.
 * @returns {Promise<WebAPICallResult>}
 */
export async function messageGeneralChat(web: WebClient, message: string): Promise<WebAPICallResult> {
    try {
        const channelsResponse = await web.channels.list();
        Winston.debug('Channels:');
        channelsResponse.channels |> prettyJson |> Winston.debug;

        const general = channelsResponse.channels.find(c => c.name === 'general');
        Winston.debug(`General chat found? ${general ? 'yes' : 'no'}`);
        return await web.chat.postMessage({
            channel: general.id,
            text: message || 'Hello World!"'
        });
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageGeneralChat.');
        throw exception;
    }
}

/**
 * __Sends a direct message to a user.__ 
 * @param {WebClient} web The instance of the Slack Web Client.
 * @param {string} userId The Slack ID or Slack username of whom the message should be sent to.
 * @param {string} message The message you wish to send to the aforementioned user.
 * @returns {Promise<WebAPICallResult>}
 */
export async function messageUser(web: WebClient, userId: string, message: string): Promise<WebAPICallResult> {
    try{
        return await web.chat.postMessage({
            channel: userId,
            text: message 
        });
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageUser.');
        throw exception;
    }
}

/**
 * __Tries to message a random user based off of who it can find in the #General channel.__
 * @param {WebClient} web The instance of the Slack Web Client.
 * @param {string} message The message you wish to send.
 * @returns {Promise<WebAPICallResult>}
 */
export async function messageRandomUser(web: WebClient, message: string): Promise<WebAPICallResult> {
    try {
        const channelsResponse = await web.channels.list();
        const general = channelsResponse.channels.find(c => c.name === 'general');
        general.members |> Winston.debug;
        const randomUser = general.members[(Math.random() * general.members.length) |> Math.floor];
        'Random User ID: ' + randomUser |> Winston.info;
        return await web.chat.postMessage({
            channel: randomUser,
            text: message || 'Hello random user'
        });
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageRandomUser.');
        throw exception;
    }
}


/**
 * __EXPERIMENTAL FEATURE: Messages App Home.__
 * @see https://api.slack.com/changelog/2018-05-app-home-events-for-workspace-apps
 * @param {WebClient} web The instance of the Slack Web Client.
 * @param {string} message The message you wish to send.
 * @returns {Promise<WebAPICallResult>}
 */
export async function messageAppHome(web: WebClient, message: string): Promise<WebAPICallResult> {
    // Use the `apps.permissions.resources.list` method to find the conversation ID for an app home
    try {
        web.apps |> prettyJson |> Winston.debug;
        const response = await web.apps.permissions.resources.list();

        // Find the app home to use as the conversation to post a message
        // At this point, there should only be one app home in the whole response since only one user has installed the app
        response.resources |> prettyJson |> Winston.debug;
        const appHome = response.resources.find(r => r.type === 'app_home');
        // Use the `chat.postMessage` method to send a message from this app
        appHome |> prettyJson |> Winston.debug;
        const result = await web.chat.postMessage({
            channel: appHome.id,
            text: message || 'Hello World'
        });
        'Message posted!' |> Winston.debug;
        result |> prettyJson |> Winston.debug;

        return result;
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageAppHome.');
        throw exception;
    }
}

