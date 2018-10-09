import { Router } from 'express';
import { messageGeneralChat } from './message.controller';

import Winston from '../../../logging/app.logger';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('/general')
        .all(messageGeneralChat);
    return router;
}

export default messageRouter();