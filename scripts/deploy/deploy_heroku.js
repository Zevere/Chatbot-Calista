const $ = require('shelljs');
const logger = require('../logging');

$.config.fatal = true;


function validate_args(...args) {
    if (!args.every(x => x && x.length)) {
        throw 'All the required parameters should have value.';
    }
}

function push_image_to_heroku(app, source, dyno, user, token) {
    logger.info('pushing docker image to heroku');

    logger.debug('connecting to heroku docker registry');
    $.exec(`echo ${token} | docker login --username ${user} --password-stdin registry.heroku.com`);

    logger.debug('tagging the image');
    $.exec(`docker tag ${source} registry.heroku.com/${app}/${dyno}`);

    logger.debug('pushing the image');
    $.exec(`docker push registry.heroku.com/${app}/${dyno}`);
}

function release_heroku_app(app, source, dyno, token) {
    logger.info('deploying the image to heroku dyno');

    logger.debug('getting docker image ID');
    const image_id = $.exec(`docker inspect ${source} --format={{.Id}}`).stdout.trim();

    logger.debug('upgrading to new release');
    const post_data = JSON.stringify({
        updates: [{
            type: dyno,
            docker_image: image_id
        }]
    });

    $.exec(`
        curl -X PATCH https://api.heroku.com/apps/${app}/formation \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
        -d ${JSON.stringify(post_data)}
    `);
}

/** 
 * Used to deploy a docker image to Heroku. The image is updated
 * immediately in a container on a Heroku dyno.
 * @param {string} app - The name of the app. This gets used in the
 * URL given by Heroku.
 * @param {string} source - The local source image; can be referred to by ID, name, or name:tag.
 * If a tag name is not specified, it will be set to "latest".
 * @param {string} dyno - The type of Heroku dyno you wish to use. This should most likely be "web".
 * @param {string} user - The username which will be used to login to Heroku's Container Registry.
 * @param {string} token - The user's token for Heroku's Container Registry authentication.
*/
exports.deploy = function (app, source, dyno, user, token) {
    validate_args(app, source, dyno, user, token);
    push_image_to_heroku(app, source, dyno, user, token);
    release_heroku_app(app, source, dyno, token);
}
