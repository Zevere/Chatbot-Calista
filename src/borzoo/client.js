// @flow

import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { LoginInput } from './login-input.model';

import { AxiosInstance, AxiosResponse } from 'axios';
import { axiosForBorzoo } from '../config/axios';



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

    login(loginInput: LoginInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }
}
