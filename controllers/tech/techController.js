import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//TECH ROUTES

//@desc Get all tech types
//@route GET /tech
//@access Private

const getAllTech =async (req, res) => {
    const tech = await prisma.tech.findMany();
    if (!tech.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No tech found'})
    }
    res.json(tech);
}

//@desc Get a tech
//@route GET /tech/:id
//@access Private
const getTechById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech ID required' });

    const tech = await prisma.tech.findUnique({ where: { id: Number(id) } });
    if (!tech) return res.status(404).json({ message: 'No tech found' });

    res.json(tech);
}

//@desc Create new tech type
//@route POST /tech/tech
//@access Private
const addTech = async (req, res, next) => {
    const { name, ecosystem, type } = req.body;
    //NB validate before making db query
    if (!name || !ecosystem || !type) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newTech = await prisma.tech.create({
            data: {
                name,
                ecosystem: { connect: { id: Number(ecosystem) } },
                type: { connect: { id: Number(type) } },
            }
        });
        res.status(201).json(newTech);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Type of tech already exists' });
        }
        next(err);
    }
};

//@desc Update a tech type
//@route PATCH /tech/tech
//@access Private
const updateTech = async (req, res, next) => { 
    const { id, name, ecosystem, type } = req.body;

    if (!id || !name || !ecosystem || !type ) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const updatedTech = await prisma.tech.update({
            where: { id },
            data: {
                name,
                ecosystem: { connect: { id: Number(ecosystem) } },
                type: { connect: { id: Number(type) } },
            }
        });
        res.json({ message: "Tech updated", tech: updatedTech });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Tech already exists" });
        }
        next(err);
    }
}

//@desc Delete a tech type
//@route DELETE /tech/tech
//@access Private
const deleteTech = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Tech ID Required'});
    }

    const projectsUsingTech = await prisma.project.findMany({
        where: {
            tech: {
                some: { id: id }
            }
        },
        select: { title: true }
    });
    if (projectsUsingTech.length > 0) {
        const projectTitles = projectsUsingTech.map(p => p.title).join('\n');
        return res.status(400).json({
            message: `Cannot delete tech. These projects use it: ${projectTitles} \n  Please remove the tech from the projects and try again.`
        }); 
    }
    try {
        await prisma.tech.delete({ where: { id } });
        res.json({ message: 'Tech (and associated skills) deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        next(err);
    }
}

export default {
    getAllTech,
    getTechById,
    addTech, 
    updateTech,
    deleteTech
}