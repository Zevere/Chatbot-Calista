import { join } from 'path';

/**
 * __Determines the directory to place the logs in.
 * Gives precedence to an APP_LOGS environment variable.
 * If it does not exist, the logs will be placed relative to the dist.__
 * @param {string} dirname The name of the log directory.
 * @returns {string} A full path to the logging directory.
 */
function resolveLogDirectory(dirname: string): string {
    // Give precedence to a path supplied in the APP_LOGS variable.
    if(process.env.APP_LOGS) {
        return join(process.env.APP_LOGS, dirname);
    }

    // Resolves to a sibling directory of debug:
    // - dist
    //    - debug
    //    - logs
    //    - release
    // Note: This assumes the debug build is NOT minified.
    if(process.env.NOD_ENV === 'development') {
        return join(__dirname, '..', '..', 'logs', dirname);
    }

    return join(__dirname, 'logs', dirname);
}

export default resolveLogDirectory;
