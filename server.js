import 'dotenv/config';
import express from 'express';
import prisma from './config/db.js';
import path from 'path';

import { logger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import sessionMiddleware from './middleware/session.js';

import rootRoutes from './routes/admin/root.js';
import dashRoutes from './routes/admin/dashRoutes.js';
import authRoutes from './routes/api/authRoutes.js';
import userRoutes from './routes/api/userRoutes.js';
import projectRoutes from './routes/api/projectRoutes.js';
import techRoutes from './routes/api/techRoutes.js';
import personalRoutes from './routes/api/personalRoutes.js';
import userAdminRoutes from './routes/admin/userAdminRoutes.js'

const app = express();
const PORT = process.env.PORT || 3500;

//MIDDLEWARE FOR REQUESTS
app.use(logger);
app.use(cors(corsOptions));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

//Static routes


//API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tech', techRoutes);
app.use('/personal', personalRoutes);

//Admin UI routes
app.use('/', rootRoutes);
app.use('/login', rootRoutes);
app.use('/dashboard', dashRoutes);
app.use('/dashboard/user', userAdminRoutes);

//404 route
//test thing
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


app.all(/.*/, (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(process.cwd(), 'views', 'root', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

//USE CUSTOM ERROR HANDLER INSTEAD OF EXPRESS DEFAULT
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Disconnect from DB on shutdown
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
