import { Router } from 'express';

import messageRouter from './message/message.router';
import loginRouter from './login/login.router';

function apiRouter() {
    const router = Router({caseSensitive: false});
    router.use('/message', messageRouter);
    router.use('/login', loginRouter);
    return router;
}

export default apiRouter();