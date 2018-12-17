/* global describe it should before */
import 'chai/register-should';

import { Client } from '../../src/borzoo/client';
import { TaskInput } from '../../src/borzoo/task-input.model';
import { List } from '../../src/borzoo/list.model';
import { Task } from '../../src/borzoo/task.model';
import dotenv from 'dotenv';
import Axios from 'axios';
dotenv.load();


function randomNumber(width: number) {
    let chars = [];
    for (let i = 0; i < width; ++i) {
        chars[i] = Math.floor(Math.random() * 10).toString();
    }
    return chars.reduce((p, c) => p + c);
}


describe('Borzoo Client', function() {
    this.timeout('30s');
    const client = new Client();
    const rndChars = randomNumber(5);
    const owner = 'test';

    let testList: List;
    let testTask: Task;

    before(async () => {
        // Ping URL to wake up server
        await Axios.get(process.env.BORZOO_URL);
    });

    it('can instantiate', () => {
        new Client();
    });

    it('#createList creates a list', async function () {
        const testInput = {
            id: `testListId${rndChars}`,
            title: `testListTitle${rndChars}`,
            description: `testListDesc${rndChars}`
        };
        testList = await client.createList(owner, testInput);

        should.exist(testList);
        testList.title.should.equal(testInput.title);
        testList.description.should.equal(testInput.description);

    });

    it('#createTask adds a task to a list', async function () {
        const taskInput: TaskInput = {
            title: `testTitle${rndChars}`,
            description: `testDesc${rndChars}`
        };
        testTask = await client.createTask(owner, testList.id, taskInput);
        testTask.title.should.equal(taskInput.title);
        testTask.description.should.equal(taskInput.description);
    });

    it('#getLists gives a list of a user\'s lists', async function () {
        const res = await client.getLists(owner);
        let pass = false;
        for (const list of res) {
            if (list.id === testList.id.toLowerCase() && list.title === testList.title && list.description === testList.description) {
                pass = true;
                break;
            }
        }
        pass.should.be.true;
    });

    it('#deleteTask successfully deletes a task', async function () {
        const res = await client.deleteTask(owner, testList.id, testTask.id);
        res.should.be.true;
    });
});
