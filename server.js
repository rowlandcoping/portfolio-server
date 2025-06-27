import 'dotenv/config';
import express from 'express';
import prisma from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { logger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';

import rootRoutes from './routes/root.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import techRoutes from './routes/techRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

//MIDDLEWARE
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());




app.use(express.static('public'));
app.use('/', rootRoutes);

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tech', techRoutes);


app.all(/.*/, (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
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
