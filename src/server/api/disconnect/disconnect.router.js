import { Router } from 'express';
import { disconnect } from './disconnect.controller';

function interactiveRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .post(disconnect);
    return router;
}

export default interactiveRouter();
