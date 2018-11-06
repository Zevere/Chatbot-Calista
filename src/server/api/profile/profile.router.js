import { getProfile } from './profile.controller';

import { Router } from 'express';

function messageRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });

    router.route('')
        .post(getProfile);

    return router;
}

export default messageRouter();
