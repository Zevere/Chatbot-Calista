import tutorial from './tutorial/index';
import dotenv from 'dotenv';

(async function main() {
    dotenv.load();
    await tutorial();
})();