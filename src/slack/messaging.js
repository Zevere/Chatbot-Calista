import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';
import { Client } from '../borzoo/client';
import { getUserBySlackId } from '../server/authorization/authorization.service';
import Axios from 'axios';


/**
 * __Provides a Login button to the user.__
 * @param {WebClient} web The instance of the Slack WebClient.
 * @param {string} userId The Slack ID or Slack username of whom to send the message to.
 * @param {string} url The URL that you wish to redirect a user to after logging in.
 * @returns {Promise<WebAPICallResult>}
 */
export async function loginPrompt(web: WebClient, userId: string, channelId: string, url: string): Promise<WebAPICallResult> {
    try {
        let webAppUrl = process.env.ZEVERE_WEB_APP_URL + '/login';
        let redirectUrl = `${url}?id=${userId}`;
        webAppUrl = `${webAppUrl}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
        return await web.chat.postEphemeral({
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
                    text: 'Click here to login:',
                }
            ],
            channel: channelId,
            user: userId,
            text: 'Please login to Zevere.',
        });
    } catch (exception) {
        Winston.error('Exception caught in messaging#loginPrompt.');
        throw exception;
    }
}


/**
 * Shows the list details to a user.
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @param {string} listId
 * @returns
 */
export async function showList(web: WebClient, userId: string, channelId: string, listId: string) {
    const bz = new Client();
    const user = await getUserBySlackId(userId);
    const lists = await bz.getLists(user.zevereId);
    const list = lists.filter(l => l.id === listId)[0];
    try {
        const fields = [];
        if (list.updatedAt)
            fields.push({ title: 'Last Updated', value: list.updatedAt, short: true });
        if (list.tags && list.tags.length > 0)
            fields.push({ title: 'Tags', value: list.tags.reduce((p, c) => `${p} ${c}`), short: true });
        if (list.createdAt)
            fields.push({ title: 'Created On', value: list.createdAt, short: true });
        return await web.chat.postMessage({
            channel: channelId,
            user: userId,
            attachments: [
                {
                    fallback: `${list.title}: ${list.description}`,
                    pretext: 'Here is your task list!',
                    color: 'good',
                    title: list.title,
                    text: list.description,
                    fields,
                    callback_id: 'clearlist',
                    actions: [
                        {
                            id: 'rmlist',
                            type: 'button',
                            text: 'Clear',
                            name: 'rmlist',
                        },
                    ],
                }
            ]
        });
    } catch (err) {
        Winston.info(err);
        throw err;
    }
}


/**
 *
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @returns {Promise<WebAPICallResult>}
 */
export async function showListsForSelection(web: WebClient, userId: string, channelId: string): Promise<WebAPICallResult> {
    const bz = new Client();
    const user = await getUserBySlackId(userId);
    const lists = await bz.getLists(user.zevereId);
    const listOptions = lists.map(list => { return { text: list.title, value: list.id }; });
    return await web.chat.postEphemeral({
        channel: channelId,
        as_user: false,
        user: userId,
        attachments: [
            {
                text: 'Select a list to view:',
                color: 'good',
                callback_id: 'viewlist',
                actions: [
                    {
                        id: 'lists',
                        type: 'select',
                        data_source: 'static',
                        options: listOptions,
                        name: 'list',
                    },
                ],
            }
        ]
    });
}


/**
 *
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @returns {Promise<WebAPICallResult>}
 */
export async function showListsForDeletion(web: WebClient, userId: string, channelId: string): Promise<WebAPICallResult> {
    const bz = new Client();
    const user = await getUserBySlackId(userId);
    const lists = await bz.getLists(user.zevereId);
    const listOptions = lists.map(list => { return { text: list.title, value: list.id }; });
    return await web.chat.postEphemeral({
        channel: channelId,
        as_user: false,
        user: userId,
        attachments: [
            {
                text: 'Select a list to delete:',
                color: 'danger',
                callback_id: 'deletelist',
                actions: [
                    {
                        id: 'lists',
                        type: 'select',
                        data_source: 'static',
                        options: listOptions,
                        name: 'list',
                        confirm: {
                            text: 'Are you sure you want to delete the list?',
                            title: 'Confirm Deletion',
                            dismiss_text: ' Cancel',
                            ok_text: 'Delete'
                        }
                    },
                ],
                footer: 'Note: Once it is deleted, it is gone forever!'
            }
        ]
    });
}


/**
 *
 *
 * @export
 * @param {WebClient} web
 * @param {string} responseUrl
 * @returns {Promise<any>}
 */
export async function confirmListDeletion(web: WebClient, responseUrl: string): Promise<any> {
    return await Axios.post(responseUrl, {
        response_type: 'ephemeral',
        replace_original: true,
        text: 'Deleted successfully.'
    });
}


/**
 * Deletes a message using the response url.
 *
 * @export
 * @param {WebClient} web
 * @param {string} responseUrl
 * @returns {Promise<any>}
 */
export async function deleteMessage(web: WebClient, responseUrl: string): Promise<any> {
    return await Axios.post(responseUrl, {
        response_type: 'ephemeral',
        text: '',
        replace_original: true,
        delete_original: true,
    });
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
    try {
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
 *
 * __Sends an ephemeral message to the user.__
 * @export
 * @param {WebClient} web The instance of the Slack Web Client.
 * @param {string} userId The Slack ID or Slack username of whom the message should be sent to.
 * @param {string} message The message you wish to send to the aforementioned user.
 * @returns {Promise<WebAPICallResult>}
 */
export async function messageUserEphemeral(web: WebClient, userId: string, channelId: string, message: string): Promise<WebAPICallResult> {
    try {
        return await web.chat.postEphemeral({
            channel: channelId,
            user: userId,
            text: message
        });
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageUserEphemeral.');
        throw exception;
    }
}
