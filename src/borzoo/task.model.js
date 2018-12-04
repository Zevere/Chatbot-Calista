// @flow
/**
 * A task item.
 * @type Task
 */
export type Task = {

    /**
     * The date the task was created on represented by a DateTimeOffset.
     *
     * __Must be an ISO 8601 datetime offset string.__
     * 
     * Example: 2018-11-07T22:59:50+00:00
     * @see https://en.wikipedia.org/wiki/ISO_8601
     * @type {string}
     * @memberof Task
     */
    createdAt: string,

    /**
     * Description of this task.
     * @type {string}
     * @memberof Task
     */
    description: string,

    /**
     * Due date of this task.
     * 
     * __Must be an ISO 8601 date string.__
     * 
     * Example: 2018-05-28
     * 
     * @see https://en.wikipedia.org/wiki/ISO_8601
     * @optional
     * @type {string}
     * @memberof Task
     */
    due?: string,

    /**
     * The task's ID.
     * @type {string}
     * @memberof Task
     */
    id: string,

    /**
     * List of tags associated with this task.
     * @optional
     * @type {string[]}
     * @memberof Task
     */
    tags?: string[],

    /**
     * Short title of this task.
     * @type {string}
     * @memberof Task
     */
    title: string
};
