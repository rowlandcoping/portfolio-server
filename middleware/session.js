import session from 'express-session';
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);

const sessionMiddleware = session({
    store: new FileStore({
        path: './sessions',
        ttl: 1000 * 60 * 60 * 2,// session expires after 30 mins
        reapInterval: 600, // expired session cleanup every 10 mins
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: 'strict'
    }
})

export default sessionMiddleware;