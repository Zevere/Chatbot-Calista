// @flow

import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { LoginInput } from './login-input.model';
import { List } from './list.model';
import { GraphQLResponse } from './graphql-response.model';
import { AxiosInstance, AxiosResponse } from 'axios';
import { axiosForBorzoo } from '../config/axios';

import Winston from '../logging/app.logger';
import { prettyJson } from '../logging/format';


export class Client {
    client: AxiosInstance;

    constructor() {
        this.client = axiosForBorzoo();
    }


    async addTask(owner: string, list: string, task: TaskInput): Promise {
        const mutation = `
        mutation ZevereMutation($userId: String!, $listId: String!, $task: TaskInput!) { 
            addTask(owner: $userId, list: $listId, task: $task) { 
                id title description due tags createdAt
            }
        }`;
        const variables = {
            owner, list, task
        };
        return await this.client.post('', {
            query: mutation, 
            variables
        });
    }

    async createList(owner: string, list: ListInput): Promise<AxiosResponse<any>> {
        const mutation = `
            mutation ZevereMutation($userId: String!, $list: ListInput!) { 
                createList(owner: $userId, list: $list) { 
                    id title createdAt
                }
            }`;

        const variables = {
            userId: owner,
            list: list
        };

        return await this.client.post('', {
            query: mutation,
            variables
        })
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
                        id, title, description, owner, createdAt, updatedAt
                    }
                }
            }
        `; 
        let response = await this.client.post<GraphQLResponse<List[]>>('', {
            query
        });

        response.data |> prettyJson |>Winston.debug;
        return response.data.data;
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
