import express from 'express';
import { foo } from './task-list.controller';
const router = express.Router();



'/' |> (path => router.get(path, foo));

export default router;