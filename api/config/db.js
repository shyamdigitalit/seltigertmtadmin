import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrlConn = String(process.env.ONLN_DBURL)
const appenv = process.env.APP_ENV || 'quality';
const env = process.env.NODE_ENV || 'dev';

const dbUrl = appenv === 'production'
    ? (env === 'live' ? (console.log('Live (Production Server)'), `${dbUrlConn}seltigerprddb`) : (console.log('Dev (Production Server)'), `${dbUrlConn}seltigerdb`))
    : (env === 'live' ? (console.log('Live (Quality Server)'), `${dbUrlConn}seltigerqasdb`) : (console.log('Dev (Quality Server)'), `${dbUrlConn}seltigerdb`));

mongoose.set('strictQuery', false); // Disable strict query mode

// console.log(dbUrl);
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl, {
            appName: 'seltigerapp',
            authSource: 'admin',
            retryWrites: true,
            w: 'majority',
            ssl: true,
            maxPoolSize: 1, // Keep per-worker connections low
            minPoolSize: 1
        });
        console.log(`Worker ${process.pid}: DB Successfully Connected...`);
    } catch (error) {
        console.error(error);
        throw new Error('Database connection failed');
    }
}

export default connectDB;
