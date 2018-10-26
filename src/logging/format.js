import { inspect } from 'util';

export function prettyJson(obj: Object): string {
    return inspect(obj, {
        colors: true,
        compact: false,
        depth: 1,
        sorted: true,
    });
}
