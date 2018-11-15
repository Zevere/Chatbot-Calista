import { Router } from 'express';
import { handleInteractiveRequest } from './interactive.controller';

function interactiveRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .post(handleInteractiveRequest);
    return router;
}

export default interactiveRouter();
