// @flow
import { axiosForBorzoo }  from '../config/axios';
import { AxiosInstance } from 'axios';
import { TaskInput } from './task-input.model';
import { ListInput } from './list-input.model';
import { UserInput } from './user-input.model';
import { LoginInput } from './login-input.model';

export class Client {
    axios: AxiosInstance;

    constructor() {
        this.axios = axiosForBorzoo();
    }

    
    addTask(owner: string, list: string, task: TaskInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
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
