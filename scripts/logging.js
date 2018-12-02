const chalk = require('chalk');
const $ = require('shelljs');

const logger = process.env['TRAVIS'] && process.env['CI'] ? {
    info:  m => $.echo('\033[1;34m', m, '\033[0m'),
    debug: m => $.echo('\033[0;32m', m, '\033[0m'),
    warn:  m => $.echo('\033[1;33m', m, '\033[0m'),
    error: m => $.echo('\033[1;31m', m, '\033[0m')
}: {
    info:  m => console.log(chalk.blue.bold(m)),
    debug: m => console.log(chalk.green.bold(m)),
    warn:  m => console.log(chalk.yellow.bold(m)),
    error: m => console.log(chalk.red.bold(m))
};

module.exports = logger;
