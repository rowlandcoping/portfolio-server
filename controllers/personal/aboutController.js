import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//@desc get about page by logged in user
//@route GET /personal/about
//@access Private
const getAboutByCurrentUser = async (req, res) => {
    const user = req.session?.userId;
    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }
    const about = await prisma.about.findUnique({ 
        where: { userId: Number(user) },
    });
    if (!about) return res.status(404).json({ message: 'No about page found for logged in user' });
    res.json(about);
}


//@desc Create new about page
//@route POST /personal/about
//@access Private
const addAbout = async (req, res, next) => {
    const { overview, type, repo, copyYear, copyName } = req.body;
    const user = req.session?.userId;

    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }
    if (!overview || !type || !repo || !copyYear || !copyName) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        //set data outside of db call 
        const data = {
            user: { connect: { id: Number(user) } },
            type: { connect: { id: Number(type) } },
            overview,
            repo,
            copyYear: Number(copyYear),
            copyName
        }
        const newAbout = await prisma.about.create({ data });
        res.status(201).json( { message: "About Page Created", about: newAbout });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'About Page already exists for this person' });
        }
        if (
            err.message &&
            err.message.includes('violate the required relation') &&
            err.message.includes('AboutToUser')
        ) {
            logEvents(`An about page already exists for this user's portfolio: ${user}`, 'dbError.log');
            return res.status(409).json({ message: "An About Page already exists for this user's portfolio." });
        }
        next(err);
    }
}

//@desc Update about page
//@route PATCH /personal/about
//@access Private
const updateAbout = async (req, res, next) => {
    const { id, overview, type, repo, copyYear, copyName } = req.body;

    if (!id || !overview || !type || !repo || !copyYear || !copyName) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const updatedAbout = await prisma.about.update({
            where: { id: Number(id) },
            data: {
                type: { connect: { id: Number(type) } },
                overview,
                repo,
                copyYear: Number(copyYear),
                copyName
            }
        });
        res.json({ message: "About Page Updated", about: updatedAbout });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `About Page with id ${id} not found` });
        }
        next(err);
    }
}

//@desc Provide about page for submitted userID to client
//@route GET /personal/about/provider
//@access Public
const getAboutByPublicId = async (req, res) => {
    const publicId = req.headers['x-user-uuid'];

    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const user = await prisma.user.findUnique({
        where: { publicId }
    })

    const about = await prisma.about.findUnique({
        where: { userId:  Number(user.id) },
        include: {
            projectEcosystem: {
                select: {
                    ecosystem: true,
                    tech: true,
                }
            }
        }
    });
    if (!about) {
        //NB any errors not handled here will be handled by our error handling middleware
        return res.status(404).json({message: 'No data found'})
    }
    res.json(about);
}

export default {
    getAboutByCurrentUser,   
    addAbout,
    updateAbout,
    getAboutByPublicId,
}