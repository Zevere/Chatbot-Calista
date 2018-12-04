// @flow
import { Task } from './task.model';

/**
 * A list of Tasks.
 * @type List
 */
export type List = {

    /**
     * User IDs of the list collaborators.
     *
     * @type {?Array<string>}
     */
    collaborators: ?Array<string>,

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
    createdAt: string,

    /**
     * The description for the list.
     * @type {string}
     * @memberof List
     */
    description: ?string,

    /**
     * The ID of the list.
     * @type {string}
     * @memberof List
     */
    id: string,

    /**
     * User ID of the owner of this list.
     *
     * @type {string}
     */
    owner: string,

    /**
     * Tags that are used to describe the list.
     *
     * @type {?Array<string>}
     */
    tags?: Array<string>,

    /**
     * The Task items in the list.
     * @optional
     * @type {Task[]}
     * @memberof List
     */
    tasks?: Task[],

    /**
     * The short title of the list.
     * @type {string}
     * @memberof List
     */
    title: string,

    /**
     * Last time this list has been updated.
     *
     * @type {Date}
     */
    updatedAt: Date
    
};
