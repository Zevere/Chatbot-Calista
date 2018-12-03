import { Router } from 'express';
import { handleOptionsRequest } from './options.controller';

function optionsRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .post(handleOptionsRequest);
    return router;
}

export default optionsRouter();
