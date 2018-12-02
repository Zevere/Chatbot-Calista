import { inspect as ins } from 'util';

/**
 * __Makes objects more readable from logs or CLI.__
 * 
 * _Note: This should __only__ be used for logging._
 * @param {Object} obj Any object.
 * @returns {string} A representation of that object in a prettified JSON string.
 */
export function prettyJson(obj: Object): string {
    return JSON.stringify(obj, {}, 2);
}


/**
 * __Makes objects more readable from logs or CLI.__
 * 
 * Handles circular dependencies.
 * 
 * _Note: This should __only__ be used for debuggin._
 * @param {Object} obj Any object.
 * @returns {string} A representation of that object in a prettified string.
 */
export function inspect(obj: Object): string {
    return ins(obj, {
        colors: true,
        compact: false,
        depth: 1,
        sorted: true,
    });
}
