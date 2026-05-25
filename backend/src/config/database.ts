import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'car_maintenance_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;
