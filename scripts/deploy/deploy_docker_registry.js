const $ = require('shelljs');
const logger = require('../logging');

$.config.fatal = true;

/**
 * Deploys an image to a docker repository using the following
 * parameters:
 * @param {string} source - The local source image; can be referred to by ID, name, or name:tag.
 * If a tag name is not specified, it will be set to "latest".
 * @param {string} target - The target name you wish to push the image to. For deploying to the Docker
 * Registry, it should be something along the lines of "zevere/calista".
 * @param {string} user - The username which will be used to login to the Docker Registry.
 * @param {string} pass - The user's password.
 */
exports.deploy = function (source, target, user, pass) {
    logger.info(`pushing docker local image ${source} to ${target}`);

    $.exec(`docker tag ${source} ${target}`);
    $.exec(`echo ${pass} | docker login --username ${user} --password-stdin`);
    $.exec(`docker push ${target}`);
    $.exec('docker logout');
}
