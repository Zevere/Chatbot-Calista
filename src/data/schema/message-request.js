import { Schema } from 'mongoose';

const MessageRequestSchema = new Schema({
    channel_id: String,
    channel_name: String,
    command: String,
    response_url: String,
    team_domain: String,
    team_id: String,
    text: String,
    token: String,
    trigger_id: String,
    user_id: String,
    user_name: String,
}, {
    collection: 'messageRequests'
});

export default MessageRequestSchema;
