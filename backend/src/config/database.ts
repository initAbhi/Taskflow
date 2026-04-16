import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import { env } from './env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: env.NODE_ENV === 'development' || env.DB_SYNC, // Useful for initial VM syncs without migrations
    logging: env.NODE_ENV === 'development',
    entities: [User, Task],
    migrations: ['dist/migrations/*.js'],
    subscribers: [],
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : (env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
});
