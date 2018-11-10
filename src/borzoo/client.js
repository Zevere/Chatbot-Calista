// @flow

import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { LoginInput } from './login-input.model';

import ApolloClient, { gql } from 'apollo-boost';
import { Task } from './task.model';



export class Client {
    client: ApolloClient;

    constructor() {
        this.client = new ApolloClient({
            uri: process.env.BORZOO_URL
        });
    }


    async addTask(owner: string, list: string, task: TaskInput): Promise<Task> {
        const mutation = gql`
        mutation ZevereMutation($userId: String!, $listId: String!, $task: TaskInput!) { 
            addTask(owner: $userId, list: $listId, task: $task) { 
                id title description due tags createdAt
            }
        }`;
        const variables = {
            owner, list, task
        };
        return await this.client.mutate({
            mutation, variables
        });
    }

    async createList(owner: string, list: ListInput) {
        const mutation = gql`
            mutation ZevereMutation($userId: String!, $list: ListInput!) { 
                createList(owner: $userId, list: $list) { 
                    id title createdAt
                    tasks { id }
                }
            }`;
        const variables = {
            userId: owner,
            list: list
        };

        return await this.client.mutate({
            mutation, variables
        })
    }

    login(loginInput: LoginInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }
}
