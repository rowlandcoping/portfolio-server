import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password:  String(process.env.DB_PASS),
    port: Number(process.env.DB_PORT) || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// helper for querying
export const query = (text, params) => pool.query(text, params);

//use pool to shutdown db connections
export default pool;