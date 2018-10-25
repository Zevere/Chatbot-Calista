import MessageRequestSchema from './schema/message-request';
import Winston from '../../logging/app.logger';
import mongoose from 'mongoose';

import { prettyJson } from '../../logging/format';

async function dbconnection(): mongoose.Connection {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });
        Winston.info('Connected to mongo.');
        mongoose.model('MessageRequest', MessageRequestSchema);
    } catch (exception) {
        exception |> prettyJson |> Winston.error;
    }
}


export default dbconnection;
