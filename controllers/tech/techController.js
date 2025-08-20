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

//@desc Get selected tech
//@route GET /tech/associated/:id
//@access Private
const getTechById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech ID required' });

    const tech = await prisma.tech.findUnique({ where: { id: Number(id) } });
    if (!tech) return res.status(404).json({ message: 'Tech not found' });

    res.json(tech);
}

//@desc Get all tech by associated ecosystem
//@route GET /tech/associated/:id
//@access Private
const getTechByEcoId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech ID required' });

    const tech = await prisma.tech.findMany({ where: { ecoId: Number(id) } });
    if (!tech) return res.status(404).json({ message: 'No tech found' });

    res.json(tech);
}

//@desc Create new tech type
//@route POST /tech/tech
//@access Private
const addTech = async (req, res, next) => {
    const { name, type, ecosystem } = req.body;
    //NB validate before making db query
    if (!name || !type || !ecosystem) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const duplicate = await prisma.tech.findFirst({
            where: {
                name: {
                equals: name,
                mode: 'insensitive'
                }
            }
        });
        if (duplicate) {
            return res.status(409).json({ message: 'Tech already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const newTech = await prisma.tech.create({
            data: {
                name,
                type: { connect: { id: Number(type) } },
                ecosystem: { connect: { id: Number(ecosystem) } },
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
    const { id, name, type, ecosystem } = req.body;

    if (!id || !name || !type || !ecosystem ) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const duplicate = await prisma.tech.findFirst({
            where: {
                name: {
                equals: name,
                mode: 'insensitive'
                },
                NOT: {
                    id: Number(id), // exclude the row being updated
                },
            }
        });
        if (duplicate) {
            return res.status(409).json({ message: 'Tech already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const updatedTech = await prisma.tech.update({
            where: { id: Number(id) },
            data: {
                name,
                type: { connect: { id: Number(type) } },
                ecosystem: { connect: { id: Number(ecosystem) } },
            }
        });

        /*
        const relatedSkills = await prisma.skill.updateMany({
            where: { techId: Number(id) },
            data: {
                name
            }
        });
        */
        res.json({ 
            message: `Tech updated.` /* + `${relatedSkills.count} related skill${relatedSkills.count !== 1 ? 's' : ''} updated.`, */,
            tech: updatedTech
        });
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
    getTechByEcoId,
    addTech, 
    updateTech,
    deleteTech
}