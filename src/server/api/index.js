import { Router } from 'express';

import loginRouter from './login/login.router';
import messageRouter from './message/message.router';
import { validateUser } from '../authorization/authorization.middleware';

/**
 * __Router to handle API routes. Has nested routers for
 * the routes that branch off of it.__
 * @returns {Router}
 */
function apiRouter(): Router {
    const router = Router({caseSensitive: false});
    router.use('/login', loginRouter);
    router.use(validateUser);
    router.use('/message', messageRouter);
    return router;
}

const router = apiRouter();

export default router;
