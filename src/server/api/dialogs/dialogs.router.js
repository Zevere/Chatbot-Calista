import { Router } from 'express';
import { createTaskDialog } from './dialogs.controller';

function dialogsRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('/createtask')
        .post(createTaskDialog);
    return router;
}

export default dialogsRouter();
