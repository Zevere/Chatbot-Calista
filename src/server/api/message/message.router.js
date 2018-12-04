import {
    messageGeneralChat,
    messageSelf,
    deleteList
} from './message.controller';

import { Router } from 'express';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });

    router.route('/general')
        .all(messageGeneralChat);

    router.route('/self')
        .all(messageSelf);

    router.route('/deletelist')
        .post(deleteList);
    return router;
}

export default messageRouter();
