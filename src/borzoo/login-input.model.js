// @flow
/**
 * Input for user login.
 * @type LoginInput
 */
export type LoginInput = {

    /**
     * User ID.
     * @type {string}
     * @memberof LoginInput
     */
    username: string,

    /**
     * Passphrase in clear text.
     * @type {string}
     * @memberof LoginInput
     */
    passphrase: string,
};
