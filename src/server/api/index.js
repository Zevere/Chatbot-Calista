import { Router } from 'express';
import messageRouter from './message/message.router';

function apiRouter() {
    const router = Router({caseSensitive: false});
    const prefix = `api/v${process.env.API_VERSION_NUMBER || 1}`;
    router.use(prefix + '/message', messageRouter);
    
    return router;
}

export default apiRouter();