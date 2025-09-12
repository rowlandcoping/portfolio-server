import fs from 'fs';
import path from 'path';
import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PERSONAL ROUTES

//@desc Get all personal profiles
//@route GET /personal
//@access Private

const getAllPersonal = async (req, res) => {
    const personal = await prisma.personal.findMany();
    if (!personal.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No data found'})
    }
    res.json(personal);
}

//@desc Retrieve data for consumption on front end
//@route GET /personal/provider
//@access Public

const getPersonalByPublicId = async (req, res) => {
    const publicId = req.headers['x-user-uuid'];
    console.log(publicId)

    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const user = await prisma.user.findUnique({
        where: { publicId }
    })
    console.log(user.id)
    const personal = await prisma.personal.findUnique({
        where: { userId:  Number(user.id) },
        include: {
            skills: {
                select: {
                    id: true,
                    name:true,
                    ecoId: true,
                    tech: true
                },
            },
            links: true,
            contact: true,
            project: {
                select: {
                    id: true
                }
            }
        }
    });
    if (!personal) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No data found'})
    }
    res.json(personal);
}


//@desc Get a personal profile to edit
//@route GET /personal/profile
//@access Private
const getUserPersonal = async (req, res) => {
    const id = req.session?.userId;
    if (!id) return res.status(401).json({ message: 'User not authorized' });

    const personal = await prisma.personal.findUnique({ 
        where: { userId: Number(id) },
    });
    if (!personal) return res.status(404).json({ message: 'No profile found for logged in user' });
    res.json(personal);
}

//@desc Create new personal profile
//@route POST /personal
//@access Private
const addPersonal = async (req, res, next) => {
    const { description,  starSign, favColor, imageAlt } = req.body;
    //NB validate before making db query
    const user = req.session?.userId;

    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }
    if (!description) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    const originalFile = req.files?.original?.[0];
    const transformedFile = req.files?.transformed?.[0];

    let imageOrg = undefined;
    let imageGrn = undefined;
    if (originalFile && transformedFile) {
        imageOrg = `/images/${originalFile.filename}`;
        imageGrn = `/images/${transformedFile.filename}`;
    }

    try {
        //set data outside of db call 
        const data = {
            user: { connect: { id: Number(user) } },
            description,
            starSign,
            favColor,
            imageAlt,
            imageOrg,
            imageGrn,
        }
        const newPersonal = await prisma.personal.create({ data });
        res.status(201).json( { message: "Profile Created", personal: newPersonal });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Personal data already exists for this person' });
        }
        if (
            err.message &&
            err.message.includes('violate the required relation') &&
            err.message.includes('PersonalToUser')
        ) {
            logEvents(`A personal profile already exists for this user ID: ${user}`, 'dbError.log');
            return res.status(409).json({ message: 'A personal profile already exists for this user.' });
        }
        next(err);
    }
};

//@desc Update personal profile
//@route PATCH /personal
//@access Private
const updatePersonal = async (req, res, next) => { 
    const { id, description, starSign, favColor, imageAlt, oldOriginal, oldTransformed } = req.body;

    if (!id || !description || !starSign  || !favColor) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    const uploadDir = path.join(process.cwd(), 'images');
        const imageOrg = req.files?.original?.[0]
            ? `/images/${req.files.original[0].filename}`
            : undefined;
        const imageGrn = req.files?.transformed?.[0]
            ? `/images/${req.files.transformed[0].filename}`
            : undefined;

    try {
        const updatedPersonal = await prisma.personal.update({
            where: { id: Number(id) },
            data: {
                description,
                starSign,
                favColor,
                imageAlt,
                imageOrg,
                imageGrn,
            }
        });
        if (req.files.original && oldOriginal) {
            fs.unlink(path.join(uploadDir, oldOriginal), (err) => {
                if (err) console.error('Failed to delete old original file:', err);
            });
        }
        if (req.files.transformed && oldTransformed) {
            fs.unlink(path.join(uploadDir, oldTransformed), (err) => {
                if (err) console.error('Failed to delete old transformed file:', err);
            });
        }
        res.json({ message: "Personal Profile Updated", personal: updatedPersonal });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Personal profile with id ${id} not found` });
        }
        next(err);
    }
}

//@desc Delete a personal profile
//@route DELETE /personal
//@access Private
const deletePersonal = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Personal Profile ID Required'});
    }
    
    try {
        await prisma.personal.delete({ where: { id } });
        res.json({ message: 'personal profile deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Personal Profile with id ${id} not found` });
        }
        next(err);
    }
}

export default {
    getAllPersonal,
    getPersonalByPublicId,
    getUserPersonal,
    addPersonal, 
    updatePersonal,
    deletePersonal
}