import { Router } from 'express';
import { login } from './login.controller';

function loginRouter() {
    const router = Router({ caseSensitive: false, mergeParams: true });
    router.route('')
        .all(login);
    return router;
}

export default loginRouter();
