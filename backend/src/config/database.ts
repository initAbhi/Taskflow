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
    synchronize: env.NODE_ENV === 'development', // Auto-sync in dev; use migrations in prod
    logging: env.NODE_ENV === 'development',
    entities: [User, Task],
    migrations: ['dist/migrations/*.js'],
    subscribers: [],
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
