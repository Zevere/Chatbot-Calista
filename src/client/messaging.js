import { WebClient, WebAPICallResult } from '@slack/client';
import Winston from '../logging/app.logger';


export async function loginPrompt(web: WebClient, userId: string): WebAPICallResult {
    let url = process.env.ZEVERE_APP_URL || 'https://zv-s-webapp-coherent.herokuapp.com/login';
    url = url |> encodeURIComponent;
    return await web.chat.postMessage({
        username: userId,
        text: 'Please login to Zevere.',
        attachments: [
            {
                actions: [
                    {
                        name: 'Login',
                        type: 'button',
                        value: 'Login',
                        url: url,
                        style: 'primary'
                    }
                ]
            }
        ]
    })
}

export async function messageGeneralChat(web: WebClient, message: string) {
    try {
        const channelsResponse = await web.channels.list();
        Winston.debug('Channels:');
        channelsResponse.channels |> JSON.stringify |> Winston.debug;

        const general = channelsResponse.channels.find(c => c.name === "general");
        Winston.debug(`General chat found? ${general ? "yes" : "no"}`);
        return await web.chat.postMessage({
            channel: general.id,
            text: message || "Hello World!"
        });
    }
    catch (exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

export async function messageRandomUser(web: WebClient, message: string) {
    try {
        const channelsResponse = await web.channels.list();
        const general = channelsResponse.channels.find(c => c.name === 'general');
        general.members |> Winston.debug;
        const randomUser = general.members[(Math.random() * general.members.length) |> Math.floor];
        'Random User ID: ' + randomUser |> Winston.info;
        await web.chat.postMessage({
            channel: randomUser,
            text: message || 'Hello random user'
        });
    }
    catch (exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

export async function messageAppHome(web: WebClient, message: string) {
    // Use the `apps.permissions.resources.list` method to find the conversation ID for an app home
    try {
        web.apps |> JSON.stringify |> Winston.debug;
        const response = await web.apps.permissions.resources.list();

        // Find the app home to use as the conversation to post a message
        // At this point, there should only be one app home in the whole response since only one user has installed the app
        response.resources |> JSON.stringify |> Winston.debug;
        const appHome = response.resources.find(r => r.type === 'app_home');
        // Use the `chat.postMessage` method to send a message from this app
        appHome |> JSON.stringify |> Winston.debug;
        const result = await web.chat.postMessage({
            channel: appHome.id,
            text: message || 'Hello World'
        });
        'Message posted!' |> Winston.debug;
        result |> JSON.stringify |> Winston.debug;
    }
    catch (exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

