import {
    messageGeneralChat,
    messageSelf
} from './message.controller';

import { Router } from 'express';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });

    router.route('/general')
        .all(messageGeneralChat);

    router.route('/self')
        .all(messageSelf);

    return router;
}

export default messageRouter();
