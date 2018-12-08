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
     * @param {string} userId - The owner of the task.
     * @param {string} list - The list ID or name.
     * @param {TaskInput} task - Information about the task you wish to create.
     * @returns {Promise<Task>} A promise containing the created task.
     * @memberof Client
     */
    async createTask(userId: string, listId: string, task: TaskInput): Promise<Task> {
        const mutation = `
        mutation ZevereMutation($userId: String!, $listId: String!, $task: TaskInput!) { 
            createTask(ownerId: $userId, listId: $listId, task: $task) { 
                id title description due tags createdAt
            }
        }`;
        const response = await this.client.post('', {
            query: mutation,
            variables: { userId, listId, task }
        });

        Winston.debug('Response from #createTask:');
        response |> prettyJson |> Winston.debug;
        return response.data.data;
    }

    /**
     * Creates a list on Zevere and returns the created list if successful.
     *
     * @param {string} owner
     * @param {ListInput} list
     * @returns {Promise<List>}
     * @memberof Client
     */
    async createList(owner: string, list: ListInput): Promise<List> {
        Winston.debug('Received list input in #createList:');
        list |> prettyJson |> Winston.debug;
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
            const response = await this.client.post('', {
                query: mutation,
                variables
            });
            Winston.debug('Response data from #createList:');
            response.data |> prettyJson |> Winston.debug;
            return response.data.data.createList;
        } catch (err) {
            Winston.error('Error caught in #createList:');
            err |> Winston.error;
            throw err;
        }
    }

    /**
     * Retrieves a list from Zevere.
     *
     * @param {string} owner
     * @param {string} listId
     * @returns {Promise<List>}
     * @memberof Client
     */
    async getList(owner: string, listId: string): Promise<List> {
        const query = `
            query GetListQuery($owner: String!, $listId: String!){
                user(userId: $owner) {
                    list(listId: $listId) {
                        id title description owner createdAt updatedAt tasks {
                            id title description
                        }
                    }
                }
            }
        `;
        const response = await this.client.post('', {
            query,
            variables: { owner, listId }
        });
        Winston.debug('Response data from #getLists:');
        response.data |> prettyJson |> Winston.debug;
        return response.data.data.user.list;
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
            query GetListsQuery($owner: String!){
                user(userId: $owner) {
                    lists {
                        id title description owner createdAt updatedAt
                    }
                }
            }
        `;
        const response = await this.client.post('', {
            query,
            variables: { owner }
        });
        Winston.debug('Response data from #getLists:');
        response.data |> prettyJson |> Winston.debug;
        return response.data.data.user.lists;
    }


    /**
     * Delete's an owner's list by ID.
     *
     * @param {string} owner - The person who owns the list you wish to delete.
     * @param {string} listId - The ID of the list that will be deleted.
     * @returns {Promise<boolean>} A promise containing true if deleted, false if not.
     * @memberof Client
     */
    async deleteList(owner: string, listId: string): Promise<boolean> {
        const mutation = `
            mutation DeleteListMutation($owner: String!, $listId: String!) {
              deleteList(owner: $owner, list: $listId)
            }`;
        const variables = {
            owner, listId
        };

        const res = await this.client.post('', {
            query: mutation,
            variables
        });

        return res;
    }

    /**
     * Gets all of the tasks for a specified list.
     *
     * @param {string} owner
     * @param {string} listId
     * @returns {Promise<Task[]>}
     * @memberof Client
     */
    async getTasks(owner: string, listId: string): Promise<Task[]> {
        const query = `
            query GetTasksQuery($owner: String!, $listId: String!){
                user(userId: $owner) {
                    list(listId: $listId) {
                        tasks { id title description createdAt }
                    }
                }
            }
        `;
        const response = await this.client.post('', {
            query,
            variables: { owner, listId }
        });
        Winston.debug('Response data from #getTasks:');
        response.data |> prettyJson |> Winston.debug;
        return response.data.data.user.list.tasks;
    }

    /**
     * Gets the specified task in the specified list.
     *
     * @param {string} owner
     * @param {string} listId
     * @param {string} taskId
     * @returns
     * @memberof Client
     */
    async getTask(owner: string, listId: string, taskId: string) { // eslint-disable-line no-unused-vars
        const tasks = await this.getTasks(owner, listId);
        Winston.info(`Tasks: ${JSON.stringify(tasks)}`);
        return tasks.find(t => t.id === taskId);
    }

    login(loginInput: LoginInput) { // eslint-disable-line no-unused-vars
        throw Error('Unimplemented');
    }
}
