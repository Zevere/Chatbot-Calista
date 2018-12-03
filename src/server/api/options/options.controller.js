import { NextFunction, Request, Response } from 'express';
import Winston from '../../../logging/app.logger';
import { prettyJson } from '../../../logging/format';
import { Client } from '../../../borzoo/client';
import { Options } from './options.model';
import { getUserBySlackId } from '../../authorization/authorization.service';

export async function handleOptionsRequest(req: Request, res: Response, next: NextFunction) {
    const bz = new Client();
    const opts: Options = req.body.payload;
    opts |> prettyJson |> Winston.info;
    try {
        const user = await getUserBySlackId(opts.user.id); 
        const lists = await bz.getLists(user.zevereId);
        const listOptions = lists.map(list => { return { label: list.title, value: list.id }; });
        res.status(200).send(listOptions);
    } catch (err) {
        err |> prettyJson |> Winston.error;
        res.status(404).send();
    }
}
