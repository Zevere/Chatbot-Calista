import { Router } from 'express';

import loginRouter from './login/login.router';
import messageRouter from './message/message.router';
import { validateUser } from '../authorization/authorization.middleware';
import profileRouter from './profile/profile.router';
import interactiveRouter from './interactive/interactive.router';
import dialogsRouter from './dialogs/dialogs.router';
import optionsRouter from './options/options.router';

/**
 * __Router to handle API routes. Has nested routers for
 * the routes that branch off of it.__
 * @returns {Router}
 */
function apiRouter(): Router {
    const router = Router({ caseSensitive: false });
    router.use('/login', loginRouter);
    router.use('/interactive', interactiveRouter);
    router.use('/options', optionsRouter);
    if (process.env.NODE_ENV !== 'development')
        router.use(validateUser);

    router.use('/message', messageRouter);
    router.use('/profile', profileRouter);
    router.use('/dialogs', dialogsRouter);
    return router;
}

const router = apiRouter();

export default router;
