/* global describe it */

import { Client } from '../../src/borzoo/client';
import { randomBytes } from 'crypto';
import { TaskInput } from '../../src/borzoo/task-input.model';

describe('Borzoo Client', () => {

    it('can instantiate', () => {
        new Client();
    });

    it('can call #addTask', async function() {
        const client = new Client();
        const rndChars = randomBytes(5).toString();
        const taskInput: TaskInput = {
            id: `testId${rndChars}`,
            title: `testTitle${rndChars}`,
            description: `testDesc${rndChars}`
        };
        try {
            await client.addTask(`owner${rndChars}`, `list${rndChars}`, taskInput);
        } catch (e) {
            if (e?.response?.status >= 500)
                throw Error('500 err; most likely an invalid endpoint');
        }
    });
});
