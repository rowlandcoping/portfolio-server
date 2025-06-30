import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';

const PgStore = pgSession(session);
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const sessionMiddleware = session({
    store: new PgStore({
        pool: pgPool,
        createTableIfMissing: true,  // <-- This tells pg-simple to auto-create the table
        tableName: 'session',        // optional, default is 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000 }, // 2 hours
});

export default sessionMiddleware