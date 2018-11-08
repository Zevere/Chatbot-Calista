// @flow

import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { UserInput } from './user-input.model';
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
        return await this.client.mutate({
            mutation: gql`
                mutation {
                    addTask(
                        $owner,
                        $list,
                        $task
                    ) {

                    }
                }
            `,
            variables: {
                owner,
                list,
                task
            }
        });
    }

    createList(owner: string, list: ListInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }

    createUser(user: UserInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }

    login(loginInput: LoginInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }
}
