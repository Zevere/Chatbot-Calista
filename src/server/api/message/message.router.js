import { Router } from 'express';
import { 
    messageGeneralChat,
    messageSelf
 } from './message.controller';

import Winston from '../../../logging/app.logger';
import { Mongoose } from 'mongoose';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });

    router.route('/general')
        .all(messageGeneralChat);

    router.route('/self')
        .all(messageSelf);

    return router;
}

export default messageRouter();