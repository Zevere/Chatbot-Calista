import express from 'express';
import { foo, bar } from './task-list.controller';
const taskListRouter = express.Router();

''  |> (route => taskListRouter.get(route, foo));
''  |> (route => taskListRouter.post(route, bar));

module.exports = taskListRouter;
