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
        Winston.debug('Received an interactive request.');
        req.body.payload |> JSON.parse |> prettyJson |> Winston.debug;
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
                Winston.debug(`Creating task ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdTask = await bz.createTask(user.zevereId, submission.tasklist, {
                    title: submission.title, 
                    description: submission.description
                });
                Winston.debug('Task created.');
                createdTask |> prettyJson |> Winston.debug;
                await messageUserEphemeral(slack, user.slackId, channel.id,`Your task, "${submission.title}" has been created!`);
                break;
            }

            case 'createlist': {
                Winston.debug(`Creating list ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdList = await bz.createList(user.zevereId, {
                    ...submission
                });
                Winston.debug('List created.');
                createdList |> prettyJson |> Winston.debug;
                await messageUserEphemeral(slack, user.slackId, channel.id, `Your task list, "${submission.title}" has been created!`);
                break;
            }

            case 'clearlist': {
                await deleteMessage(slack, response_url);
                break;
            }

            case 'deletelist': {
                const listId = actions[0].selected_options[0].value;
                Winston.debug(`Deleting task ${listId} for ${user.zevereId} / ${user.slackId}.`);
                if(await bz.deleteList(user.zevereId, listId)) {
                    Winston.debug('Deleted list: ' + listId);
                    await confirmListDeletion(slack, response_url);
                } else {
                    Winston.debug('Could not delete list: ' + listId);
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

            case 'deletetask': {
                if(actions[0].value === 'hide')
                    return await deleteMessage(slack, response_url);

                const { user, listId, taskId } = JSON.parse(actions[0].value);
                const isDeleted = await bz.deleteTask(user.zevereId, listId, taskId);
                if(isDeleted) {
                    await deleteMessage(slack, response_url);
                    await messageUserEphemeral(slack, user.slackId, channel.id, 'Successfully deleted task.');
                } else {
                    await messageUserEphemeral(
                        slack, 
                        user.slackId,
                        channel.id,
                        `Oops, we could not delete the task. If the problem persists, <${process.env.ZEVERE_WEB_APP_URL}|try directly on the website.>`
                    );
                }
                break;
            }
            default:
                break;
        }
    } catch (exception) {
        exception |> Winston.error;
    }
}
