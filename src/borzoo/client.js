// @flow

import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { LoginInput } from './login-input.model';
import { List } from './list.model';
import { Task } from './task.model';
import { AxiosInstance } from 'axios';
import { axiosForBorzoo } from '../config/axios';

import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';


/**
 * A client for the Borzoo GraphQL API.
 *
 * @export
 * @class Client
 */
export class Client {
    client: AxiosInstance;

    constructor() {
        this.client = axiosForBorzoo();
    }


    /**
     * Adds a task to a chosen list for a user.
     *
     * @param {string} owner - The owner of the task.
     * @param {string} list - The list ID or name.
     * @param {TaskInput} task - Information about the task you wish to create.
     * @returns {Promise<Task>} A promise containing the created task.
     * @memberof Client
     */
    async addTask(owner: string, list: string, task: TaskInput): Promise<Task> {
        const mutation = `
        mutation ZevereMutation($userId: String!, $listId: String!, $task: TaskInput!) { 
            addTask(owner: $userId, list: $listId, task: $task) { 
                id title description due tags createdAt
            }
        }`;
        const variables = {
            owner, list, task
        };
        const response =  await this.client.post('', {
            query: mutation, 
            variables
        });

        Winston.info('Response from #addTask:');
        response |> prettyJson |> Winston.info;
        return response.data.data;
    }

    async createList(owner: string, list: ListInput): Promise<List> {
        Winston.info('Received list input in #createList:');
        list |> prettyJson |> Winston.info;
        const mutation = `
            mutation CreateListMutation($owner: String! $list: ListInput!) { 
                createList(owner: $owner, list: $list) { 
                    id owner title description collaborators tags createdAt updatedAt
                }
            }`;
        const variables = {
            owner, list
        };
        try {
            let response = await this.client.post('', {
                query: mutation,
                variables
            });
            Winston.info('Response data from #createList:');
            response.data |> prettyJson |> Winston.info;
            return response.data.data.createList;
        } catch (err) {
            Winston.error('Error caught in #createList:');
            err |> Winston.error;
            throw err;
        }
    }

    /**
     * Returns the lists that the specified owner has.
     *
     * @param {string} owner - The one who you wish to get the lists for.
     * @returns {Promise<List[]>} A promise containing the owner's lists.
     * @memberof Client
     */
    async getLists(owner: string): Promise<List[]> {
        const query = `
            query {
                user(userId: "${owner}") {
                    lists {
                        id title description owner createdAt updatedAt
                    }
                }
            }
        `; 
        let response = await this.client.post('', {
            query
        });
        Winston.info('Response data from #getLists:');
        response.data |> prettyJson |>Winston.info;
        return response.data.data.user.lists;
    }

    async getTasks(owner: string, listId: string) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }

    async getTask(owner: string, listId: string, taskId: string) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }

    login(loginInput: LoginInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }
}
