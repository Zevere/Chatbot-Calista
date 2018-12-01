// @flow
export type UserInput = {
    /**
     * The desired user name. User names are case-insensitive. 
     * Valid characters are ASCII alphanumeric characters, '_', '.', and '-'.
     * @type {string}
     * @memberof UserInput
     */
    name: string,

    /**
     * User's first name.
     * @type {string}
     * @memberof UserInput
     */
    firstName: string,

    /**
     * Passphrase in clear text.
     * @type {string}
     * @memberof UserInput
     */
    passPhrase: string,

    /**
     * User's last name.
     * 
     * @optional
     * @type {string}
     * @memberof UserInput
     */
    lastName: ?string,

    /**
     *
     * If creating an organization user, user IDs of team members. 
     * They will be added as collaborators.
     * 
     * @optional
     * @type {string[]}
     * @memberof UserInput
     */
    members: ?string[];
};
