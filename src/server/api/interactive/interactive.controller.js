import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';
import { Client as BorzooClient } from '../../../borzoo/client';
import { getUserBySlackId } from '../../authorization/authorization.service';
import { messageUser, confirmListDeletion } from '../../../slack/messaging';

/**
 * This endpoint is used by Slack when using interactive components.
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
            response_url,
            user: {
                id
            },
            submission // comes from the Slack form
        } = JSON.parse(req.body.payload); // the payload is a JSON string inside of the JSON string
        Winston.info('Submission:');
        submission |> prettyJson |> Winston.info;

        const user = await getUserBySlackId(id);

        switch (callback_id) {

            case 'createlist': {
                Winston.info(`Creating list ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdList = await bz.createList(user.zevereId, {
                    id: submission.title,
                    ...submission
                });
                Winston.info('List created.');
                createdList |> prettyJson |> Winston.info;
                await messageUser(slack, user.slackId, `Your task list, "${submission.title}" has been created!`);
                break;
            }

            case 'createtask': {
                Winston.info(`Creating task ${submission.title} for ${user.zevereId} / ${user.slackId}.`);
                const createdTask = await bz.addTask(user.zevereId, submission.tasklist, submission);
                Winston.info('List created.');
                createdTask |> prettyJson |> Winston.info;
                await messageUser(slack, user.slackId, `Your task list, "${submission.title}" has been created!`);
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
                    await messageUser(slack, user.slackId, `Could not delete ${submission.list}.`);
                }
                break;
            }
            
            case 'deletetask':
            case 'viewtask':
            case 'viewlist':
            default:
                break;
        }
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
    }
}
