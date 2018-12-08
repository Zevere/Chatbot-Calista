import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';
import { Client as BorzooClient } from '../../../borzoo/client';
import { getUserBySlackId } from '../../authorization/authorization.service';
import { confirmListDeletion, deleteMessage, showList, messageUserEphemeral, showTask } from '../../../slack/messaging';

/**
 * This endpoint is used by Slack when using interactive components.
 * @see https://api.slack.com/interactive-messages
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export async function handleInteractiveRequest(req: Request, res: Response, next: NextFunction) { // eslint-disable-line no-unused-vars
    try {
        res.status(200).send();
        const slack = new SlackClient();
        const bz = new BorzooClient();
        Winston.info('Received an interactive request.');
        req.body.payload |> JSON.parse |> prettyJson |> Winston.info;
        const {
            actions,
            callback_id,
            channel,
            response_url,
            user: {
                id
            },
            submission // comes from the Slack form
        } = JSON.parse(req.body.payload); // the payload is a JSON string inside of the JSON string

        const user = await getUserBySlackId(id);

        switch (callback_id) {
            case 'createtask': {
                Winston.info(`Creating task ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdTask = await bz.createTask(user.zevereId, submission.tasklist, submission);
                Winston.info('List created.');
                createdTask |> prettyJson |> Winston.info;
                await messageUserEphemeral(slack, user.slackId, channel.id,`Your task, "${submission.title}" has been created!`);
                break;
            }

            case 'createlist': {
                Winston.info(`Creating list ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdList = await bz.createList(user.zevereId, {
                    id: submission.title,
                    ...submission
                });
                Winston.info('List created.');
                createdList |> prettyJson |> Winston.info;
                await messageUserEphemeral(slack, user.slackId, channel.id, `Your task list, "${submission.title}" has been created!`);
                break;
            }

            case 'clearlist': {
                await deleteMessage(slack, response_url);
                break;
            }

            case 'deletelist': {
                const listId = actions[0].selected_options[0].value;
                Winston.info(`Deleting task ${listId} for ${user.zevereId} / ${user.slackId}.`);
                if(await bz.deleteList(user.zevereId, listId)) {
                    Winston.info('Deleted list: ' + listId);
                    await confirmListDeletion(slack, response_url);
                } else {
                    Winston.info('Could not delete list: ' + listId);
                    await messageUserEphemeral(slack, user.slackId, channel.id,`Could not delete ${submission.list}.`);
                }
                break;
            }
            
            case 'viewlist': {
                const listId = actions[0].selected_options[0].value;
                await deleteMessage(slack, response_url);
                await showList(slack, user.slackId, channel.id, listId);
                break;
            }
            
            case 'viewtask': {
                const ids = JSON.parse(actions[0].value);
                ids |> prettyJson |> Winston.debug;
                await deleteMessage(slack, response_url);
                await showTask(slack, user, channel.id, ids.listId, ids.taskId);
                break;
            }

            case 'deletetask':
            default:
                break;
        }
    } catch (exception) {
        exception |> Winston.error;
    }
}
