import mongoose from 'mongoose';
import Winston from '../../logging/app.logger';
import { prettyJson } from '../../logging/format';
import MessageRequestSchema from './schema/message-request';

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