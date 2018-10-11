import { Schema } from 'mongoose';

const MessageRequestSchema = new Schema({
    token: String,
    team_id: String,
    team_domain: String,
    channel_id: String,
    channel_name: String,
    user_id: String,
    user_name: String,
    command: String,
    text: String,
    response_url: String,
    trigger_id: String
}, {
    collection: 'messageRequests'
});

export default MessageRequestSchema;