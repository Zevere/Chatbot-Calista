import { Router } from 'express';

import Client from '../../../client';
import { messageHome } from './message.controller';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .get(messageHome);
}

