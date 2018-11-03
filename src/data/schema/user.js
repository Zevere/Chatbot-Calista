import { Schema } from 'mongoose';

/**
 * __Represents a link between a Slack Account and a Zevere
 * account.__
 * @export
 * @class User
 */
export class User {
    constructor() {
        this.slackId = '';
        this.zevereId = '';
    }
}

const UserSchema = new Schema(new User(), {
    collection: 'users'
});

/** 
 * __A Schema of the User class.__
 * @see {User}
 * @returns {Schema}
*/
export default UserSchema;
