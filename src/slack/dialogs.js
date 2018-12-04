import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';
import { Dialog } from '@slack/client/dist/methods';


function dialogOf(dialog: Dialog) {
    return async (web: WebClient, text: string, triggerId: string) => {
        try {
            return await web.dialog.open({
                token: process.env.ZEVERE_SLACK_TOKEN,
                trigger_id: triggerId,
                dialog
            });
        } catch (error) {
            Winston.error('Exception caught in dialog creation.');
            error |> Winston.error;
            throw error;
        }
    };
}


export async function createTask(web: WebClient, text: string, triggerId: string): Promise<WebAPICallResult> {
    const dialog: Dialog = {
        callback_id: 'createtask',
        title: 'Create a Task on Zevere',
        elements: [
            {
                label: 'Title',
                name: 'title',
                type: 'text',
                hint: 'The title of your new task.',
                value: text || 'New Task'
            },
            {
                label: 'Description',
                type: 'textarea',
                name: 'description',
                optional: true,
            },
            {
                label: 'List',
                name: 'tasklist',
                type: 'select',
                data_source: 'external',
            },
        ]
    };

    return await ((dialog |> dialogOf)(web, text, triggerId));
}


export async function createList(web: WebClient, text: string, triggerId: string): Promise<WebAPICallResult> {
    const dialog: Dialog = {
        callback_id: 'createlist',
        title: 'Create a List on Zevere',
        submit_label: 'Create',
        elements: [
            {
                label: 'Title',
                name: 'title',
                type: 'text',
                hint: 'The title of your new list.',
                value: text || '',
                optional: false
            },
            {
                label: 'Description',
                type: 'textarea',
                name: 'description',
                hint: 'A description of your list.',
                optional: true,
            },
        ]
    };
    return await ((dialog |> dialogOf)(web, text, triggerId));
}


export async function deleteList(web: WebClient, text: string, triggerId: string): Promise<WebAPICallResult> {
    const dialog: Dialog = {
        callback_id: 'deletelist',
        title: 'Delete a List on Zevere',
        submit_label: 'Delete',
        elements: [
            {
                label: 'Lists',
                type: 'select',
                name: 'list',
                data_source: 'external'
            }
        ]
    };
    return await ((dialog |> dialogOf)(web, text, triggerId));
}
