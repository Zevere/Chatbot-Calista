import { WebClient } from '@slack/client';
import Winston from '../logging/app.logger';


export async function messageGeneralChat(web: WebClient, message: string) {
    try {
        const channelsResponse = await web.channels.list();
        Winston.info('Channels:');
        channelsResponse.channels |> JSON.stringify |> Winston.info;

        const general = channelsResponse.channels.find(c => c.name === "general");
        Winston.info(`General chat found? ${general ? "yes" : "no"}`);
        return await web.chat.postMessage({
            channel: general.id,
            text: message || "Hello World!"
        });
    }
    catch (exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

export async function messageRandomUser(web: WebClient) {
    try {
        const channelsResponse = await web.channels.list();
        const general = channelsResponse.channels.find(c => c.name === 'general');
        general.members |> Winston.info;
        const randomUser = general.members[(Math.random() * general.members.length) |> Math.floor];
        'Random User ID: ' + randomUser |> Winston.info;
        await web.chat.postMessage({
            channel: randomUser,
            text: 'Hello random user'
        });
    }
    catch(exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

export async function messageAppHome(web: WebClient) {
    // Use the `apps.permissions.resources.list` method to find the conversation ID for an app home
    try {
        web.apps |> JSON.stringify |> Winston.info;
        const response = await web.apps.permissions.resources.list();

        // Find the app home to use as the conversation to post a message
        // At this point, there should only be one app home in the whole response since only one user has installed the app
        response.resources |> JSON.stringify |> Winston.info;
        const appHome = response.resources.find(r => r.type === 'app_home');
        // Use the `chat.postMessage` method to send a message from this app
        appHome |> JSON.stringify |> Winston.info;
        const result = await web.chat.postMessage({
            channel: appHome.id,
            text: `The current time is ${currentTime}`
        });
        'Message posted!' |> Winston.info;
        result |> JSON.stringify |> Winston.info;
    }
    catch (exception) {
        exception |> JSON.stringify |> Winston.error;
    }
}

