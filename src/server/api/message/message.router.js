import {
    deleteList,
    viewList
} from './message.controller';

import { Router } from 'express';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });

    router.route('/deletelist')
        .post(deleteList);

    router.route('/viewlist')
        .post(viewList);
    return router;
}

export default messageRouter();
