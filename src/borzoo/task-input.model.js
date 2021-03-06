// @flow
/**
 * Input model for creating a new task.
 * @type TaskInput
 */
export type TaskInput = {
        
    /**
     * Short title of the new task.
     * @type {string}
     * @memberof TaskInput
     */
    title: string,
    
    /**
     * Description of the new task.
     * @optional
     * @type {string}
     * @memberof TaskInput
     */
    description: ?string,

    /**
     * Due date of the new task.
     * 
     * __Must be an ISO 8601 date string.__
     * 
     * Example: 2018-05-28
     * 
     * @see https://en.wikipedia.org/wiki/ISO_8601
     * @optional
     * @type {string}
     * @memberof TaskInput
     */
    due?: string,
    
    /**
     * List of tags on the new task item.
     * @optional
     * @type {string[]}
     * @memberof TaskInput
     */
    tags?: string[]
};
