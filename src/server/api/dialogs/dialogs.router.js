import { Router } from 'express';
import { createTaskDialog, createListDialog } from './dialogs.controller';

function dialogsRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('/createtask')
        .post(createTaskDialog);
    router.route('/createlist')
        .post(createListDialog);
    return router;
}

export default dialogsRouter();
