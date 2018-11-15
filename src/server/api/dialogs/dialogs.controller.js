import { createTask, createList } from '../../../slack/dialogs';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';


export async function createTaskDialog(req: Request, res: Response, next: NextFunction) {
    const client = new SlackClient();
    const { text, trigger_id } = req.body;
    try {
        res.status(200).send('Ok!');
        return await createTask(client, text, trigger_id);
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}

export async function createListDialog(req: Request, res: Response, next: NextFunction) {
    const client = new SlackClient();
    const { text, trigger_id } = req.body;
    try {
        res.status(200).send('Ok!');
        return await createList(client, text, trigger_id);
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
        next(exception);
    }
}
