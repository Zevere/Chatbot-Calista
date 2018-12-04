import { createTask, createList } from '../../../slack/dialogs';
import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { SlackClient } from '../../../slack';


function handleDialog(dialogFn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const client = new SlackClient();
        const { text, trigger_id } = req.body;
        try {
            res.status(200).send('Ok!');
            return await dialogFn(client, text, trigger_id);
        } catch (exception) {
            exception |> prettyJson |> Winston.error;
            next(exception);
        }
    };
}


export async function createTaskDialog(req: Request, res: Response, next: NextFunction) {
    return await ((createTask |> handleDialog)(req, res, next));
}


export async function createListDialog(req: Request, res: Response, next: NextFunction) {
    return await ((createList |> handleDialog)(req, res, next));
}
