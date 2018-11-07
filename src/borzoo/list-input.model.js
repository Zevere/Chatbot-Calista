// @flow
/**
 * @class ListInput
 */
export class ListInput {

    /**
     * The desired task list name. Names are case insensitive and valid characters are 
     * ASCII alphanumeric characters, '_', '.', and '-'.
     * @type {string}
     * @memberof ListInput
     */
    id: string;
    
    /**
     * Short title of task list.
     * @type {string}
     * @memberof ListInput
     */
    title: string;

    constructor() {
        this.id = '';
        this.title = '';
    }
}
