"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'car_maintenance_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
exports.default = pool;
//# sourceMappingURL=database.js.map