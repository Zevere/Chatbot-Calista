import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';

export async function loginPrompt(web: WebClient, userId: string, url: string): Promise<WebAPICallResult> {
    try {
        let webAppUrl = process.env.ZEVERE_APP_URL || 'https://zv-s-webapp-coherent.herokuapp.com/login';
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

