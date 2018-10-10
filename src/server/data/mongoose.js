import * as mongoose from 'mongoose';
import Winston from '../../logging/app.logger';

async function dbconnection(): mongoose.Connection {
    let db;
    try {
        db = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        db.connection.on('error', console.error.bind(console, 'connection error: '));
        db.connection.once('open', () => {
            Winston.info('Connected to database.');
        });
        return db.connection;
    } catch (exception) {
        
    }
}


export default dbconnection;