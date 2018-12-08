import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';
import { Client } from '../borzoo/client';
import { getUserBySlackId } from '../server/authorization/authorization.service';
import Axios from 'axios';
import { User } from '../data/schema/user';


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
                    thumb_url: 'https://avatars3.githubusercontent.com/u/33139090?s=200&v=4',
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


//#region Tasks


/**
 *
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @param {string} listId
 * @param {string} taskId
 * @returns {Promise}
 */
export async function showTask(web: WebClient, user: User, channelId: string, listId: string, taskId: string) {
    try {
        const bz = new Client();
        const task = await bz.getTask(user.zevereId, listId, taskId);
        const taskUrl = `${process.env.ZEVERE_WEB_APP_URL}/users/${encodeURIComponent(user.zevereId)}/lists/${encodeURIComponent(listId)}/tasks/${encodeURIComponent(taskId)}`;
        const fields = [];
        if (task.due)
            fields.push({ title: 'Due on:', value: task.due, short: false });
        if (task.tags && task.tags.length > 0)
            fields.push({ title: 'Tags', value: task.tags.reduce((p, c) => `${p} ${c}`, ''), short: true });
        if (task.createdAt)
            fields.push({ title: 'Created On', value: task.createdAt, short: true });

        const attachments = [
            {
                fallback: taskUrl,
                pretext: 'Here is your task!',
                color: 'good',
                title: task.title,
                title_link: taskUrl,
                text: task.description,
                fields,
                callback_id: 'deletetask',
                actions: [
                    {
                        type: 'button',
                        text: 'Hide',
                        name: 'taskAction',
                        value: 'hide'
                    },
                    {
                        type: 'button',
                        text: 'Delete',
                        name: 'taskAction',
                        value: JSON.stringify({ user, listId, taskId }),
                        confirm: {
                            dismiss_text: 'Cancel',
                            ok_text: 'Delete',
                            title: 'Delete Task',
                            text: 'Once it is deleted, it is gone forever!'
                        }
                    }
                ]
            }
        ];

        return await web.chat.postEphemeral({
            channel: channelId,
            user: user.slackId,
            attachments
        });
    } catch (err) {
        Winston.info(err);
        throw err;
    }
}


//#endregion Tasks
//#region Lists


/**
 * Shows the list details to a user.
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @param {string} listId
 * @returns {Promise} Awaitable.
 */
export async function showList(web: WebClient, userId: string, channelId: string, listId: string): Promise {
    const bz = new Client();
    const user = await getUserBySlackId(userId);
    const list = await bz.getList(user.zevereId, listId);
    const listUrl = `${process.env.ZEVERE_WEB_APP_URL}/users/${encodeURIComponent(user.zevereId)}/lists/${encodeURIComponent(list.id)}`;
    try {
        const fields = [];
        if (list.updatedAt)
            fields.push({ title: 'Last Updated', value: list.updatedAt, short: true });
        if (list.tags && list.tags.length > 0)
            fields.push({ title: 'Tags', value: list.tags.reduce((p, c) => `${p} ${c}`, ''), short: true });
        if (list.createdAt)
            fields.push({ title: 'Created On', value: list.createdAt, short: true });

        const attachments = [
            {
                fallback: listUrl,
                pretext: 'Here is your task list!',
                color: 'good',
                title: list.title,
                title_link: listUrl,
                text: list.description,
                fields,
                callback_id: 'viewtask',
                actions: list.tasks && list.tasks.length > 0 ?
                    list.tasks.map(t => {
                        return {
                            type: 'button',
                            name: 'task',
                            text: t.title,
                            value: JSON.stringify({ listId: listId, taskId: t.id })
                        };
                    }) : [],
            }
        ];

        return await web.chat.postEphemeral({
            as_user: false,
            channel: channelId,
            user: userId,
            attachments
        });
    } catch (err) {
        Winston.info(err);
        throw err;
    }
}


type ListOptions = {
    callbackId: string,
    text: string,
    color?: string,
    footer?: string,
    confirm?: {
        text: string,
        title: string,
        dismiss_text: string,
        ok_text: string
    }
}

function showListsWith(opts: ListOptions) {
    return async function (web: WebClient, userId: string, channelId: string): Promise<WebAPICallResult> {
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
                    text: opts.text,
                    color: opts.color || '#777777',
                    callback_id: opts.callbackId,
                    actions: [
                        {
                            id: 'lists',
                            type: 'select',
                            data_source: 'static',
                            options: listOptions,
                            name: 'list',
                            confirm: opts.confirm || undefined
                        },
                    ],
                    footer: opts.footer || undefined
                }
            ]
        });
    }
}


/**
 * Displays a select menu of the user's lists so they may view one.
 *
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @returns {Promise<WebAPICallResult>}
 */
export async function showListsForSelection(web: WebClient, userId: string, channelId: string): Promise<WebAPICallResult> {
    return await showListsWith({
        text: 'Select a list to view:',
        color: 'good',
        callbackId: 'viewlist'
    })(web, userId, channelId);
}


/**
 * Displays a select menu of the user's lists so that the user may
 * choose to delete one.
 * @export
 * @param {WebClient} web
 * @param {string} userId
 * @param {string} channelId
 * @returns {Promise<WebAPICallResult>}
 */
export async function showListsForDeletion(web: WebClient, userId: string, channelId: string): Promise<WebAPICallResult> {
    return await showListsWith({
        text: 'Select a list to delete:',
        color: 'danger',
        callbackId: 'deletelist',
        footer: 'Note: Once it is deleted, it is gone forever!',
        confirm: {
            text: 'Are you sure you want to delete the list?',
            title: 'Confirm Deletion',
            dismiss_text: ' Cancel',
            ok_text: 'Delete'
        }
    })(web, userId, channelId);
}


/**
 * Sends a message to confirm that a list has been deleted.
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


//#endregion Lists
//#region General

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
            text: message,
        });
    }
    catch (exception) {
        Winston.error('Exception caught in messaging#messageUserEphemeral.');
        throw exception;
    }
}


//#endregion General
