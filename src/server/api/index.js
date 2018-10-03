import { Router } from 'express';
import messageRouter from './message/message.router';

function apiRouter() {
    const router = Router({caseSensitive: false});
    router.use('/message', messageRouter);
    
    return router;
}

export default apiRouter();