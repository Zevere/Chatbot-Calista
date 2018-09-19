import tutorial from './tutorial';
import dotenv from 'dotenv';

(async function main() {
    dotenv.load();
    await tutorial();
})();