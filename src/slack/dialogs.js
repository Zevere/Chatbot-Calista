import { WebAPICallResult, WebClient } from '@slack/client';
import Winston from '../logging/app.logger';

export async function createTask(web: WebClient, text: string, triggerId: string): Promise<WebAPICallResult> {
    try {
        return await web.dialog.open({
            token: process.env.ZEVERE_SLACK_TOKEN,
            trigger_id: triggerId,
            dialog: {
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
            }
        });
    } catch (exception) {
        Winston.error('Exception caught in dialogs#createTask.');
        exception?.data?.response_metadata?.messages |> Winston.error;
        throw exception;
    }
}

export async function createList(web: WebClient, text: string, triggerId: string): Promise<WebAPICallResult> {
    try {
        return await web.dialog.open({
            token: process.env.ZEVERE_SLACK_TOKEN,
            trigger_id: triggerId,
            dialog: {
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
            }
        });
    } catch (exception) {
        Winston.error('Exception caught in dialogs#createTask.');
        exception?.data?.response_metadata?.messages |> Winston.error;
        throw exception;
    }
}
