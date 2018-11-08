import { List } from './list.model';

// @flow
/**
 * A Zevere user account.
 * @class User
 */
export class User {
    /**
     * Number of days since this user has joined.
     * @type {number}
     * @memberof User
     */
    daysJoined: number;

    /**
     * First Name of this user.
     * @type {string}
     * @memberof User
     */
    firstName: string;

    /**
     * The user's username.
     * @type {string}
     * @memberof User
     */
    id: string;

    /**
     * The date account was created in UTC format.
     *
     * __Must be an ISO 8601 date string.__
     * 
     * Example: 2018-11-07
     * @see https://en.wikipedia.org/wiki/ISO_8601
     * @type {string}
     * @memberof User
     */
    joinedAt: string;

    /**
     * The user's last name.
     * @optional
     * @type {string}
     * @memberof User
     */
    lastName: string;

    /**
     * The task lists that this user has access to.
     * @optional
     * @type {List[]}
     * @memberof User
     */
    lists: List[];
    
    /**
     * Authentication token.
     * @optional
     * @type {string}
     * @memberof User
     */
    token: string;

    constructor() {
        this.daysJoined = 0;
        this.firstName = '';
        this.id = '';
        this.joinedAt = '';
        this.lastName = '';
        this.lists = [];
        this.token = '';
    }
}
