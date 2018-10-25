import { Router } from 'express';

import loginRouter from './login/login.router';
import messageRouter from './message/message.router';

function apiRouter() {
    const router = Router({caseSensitive: false});
    router.use('/message', messageRouter);
    router.use('/login', loginRouter);
    return router;
}

export default apiRouter();
