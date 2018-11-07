// @flow
/**
 * Input for user login.
 * @class LoginInput
 */
export class LoginInput {

    /**
     * User ID.
     * @type {string}
     * @memberof LoginInput
     */
    username: string;

    /**
     * Passphrase in clear text.
     * @type {string}
     * @memberof LoginInput
     */
    passphrase: string;

    constructor() {
        this.username = '';
        this.passphrase = '';
    }
}
