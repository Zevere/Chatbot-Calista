import { inspect } from 'util';

/**
 * __Makes objects more readable from logs or CLI.__
 * 
 * _Note: This should __only__ be used for logging._
 * @param {Object} obj Any object.
 * @returns {string} A representation of that object in a prettified string.
 */
export function prettyJson(obj: Object): string {
    // Using inpect instead of JSON.stringify because inspect can deal with circular objects.
    return inspect(obj, {
        colors: true,
        compact: false,
        depth: 1,
        sorted: true,
    });
}
