import { Router } from 'express';
import { promptLogin } from './login.controller';

function loginRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .all(promptLogin);
    return router;
}

export default loginRouter();
