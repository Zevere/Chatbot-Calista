// @flow
import { Task } from './task.model';

/**
 * A list of Tasks.
 * @class List
 */
export class List {
    /**
     * The date the list was created on represented by a DateTimeOffset.
     *
     * __Must be an ISO 8601 datetime offset string.__
     * 
     * Example: 2018-11-07T22:59:50+00:00
     * @see https://en.wikipedia.org/wiki/ISO_8601
     * @type {string}
     * @memberof List
     */
    createdAt: string;

    /**
     * The ID of the list.
     * @type {string}
     * @memberof List
     */
    id: string;

    /**
     * The Task items in the list.
     * @optional
     * @type {Task[]}
     * @memberof List
     */
    tasks: Task[];

    /**
     * The short title of the list.
     * @type {string}
     * @memberof List
     */
    title: string;

    constructor() {
        this.createdAt = '';
        this.id = '';
        this.tasks = [];
        this.title = '';
    }
}
