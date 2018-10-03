import { Router } from 'express';

import Client from '../../../client';
import { messageHome } from './message.controller';
import Winston from '../../../logging/app.logger';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .get(messageHome);
    return router;
}

export default messageRouter();