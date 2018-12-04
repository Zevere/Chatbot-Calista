// @flow
export type ListInput = {
    /**
     * The desired task list identifier. ID is case insensitive and valid characters are 
     * ASCII alphanumeric characters, '_', '.', and '-'.
     * @type {string}
     * @memberof ListInput
     */
    id: string,
    
    /**
     * Short title of task list.
     * @type {string}
     * @memberof ListInput
     */
    title: string,
    
    /**
     * A description of the list.
     *
     * @type {string}
     * @memberof ListInput
     */
    description?: string,
    
    /**
     * Collaborators of the list.
     * 
     * @optional
     * @type {string[]}
     * @memberof ListInput
     */
    collaborators?: string[],

    /**
     * The List's tags.
     * 
     * @optional
     * @type {string[]}
     * @memberof ListInput
     */

    tags?: string[]
};
