import { Schema } from 'mongoose';

export class User {
    constructor() {
        this.slackId = '';
        this.zevereId = '';
    }
}

const UserSchema = new Schema(new User(), {
    collection: 'users'
});

export default UserSchema;
