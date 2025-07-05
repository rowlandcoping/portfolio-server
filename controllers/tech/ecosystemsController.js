import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ECOSYSTEM ROUTES

//@desc Get all ecosystems
//@route GET /tech/ecosystems
//@access Private

const getAllEcosystems =async (req, res) => {
    const ecosystems = await prisma.ecosystem.findMany();
    if (!ecosystems.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No ecosystems found'})
    }
    res.json(ecosystems);
}

//@desc Get an ecosystem
//@route GET /tech/ecosystems/:id
//@access Private
const getEcosystemById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Ecosystem ID required' });

    const ecosystem = await prisma.ecosystem.findUnique({ where: { id: Number(id) } });
    if (!ecosystem) return res.status(404).json({ message: 'No ecosystem found' });

    res.json(ecosystem);
}

//@desc Create new ecosystem
//@route POST /tech/ecosystems
//@access Private
const addEcosystem = async (req, res, next) => {
    const { name, type } = req.body;
    //NB validate before making db query
    if (!name || !type) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newEcosystem = await prisma.ecosystem.create({
            data: {
                name,
                type: { connect: { id: Number(type) } },
            }
        });
        res.status(201).json(newEcosystem);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Ecosystem already exists' });
        }
        next(err);
    }
};

//@desc Update an ecosystem type
//@route PATCH /tech/ecosystems
//@access Private
const updateEcosystem = async (req, res, next) => { 
    const { id, name, type } = req.body;

    if (!id || !name || !type) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const updatedEcosystem = await prisma.ecosystem.update({
            where: { id: Number(id) },
            data: {
                name,
                type: { connect: { id: Number(type) } },
            }
        });
        const relatedSkills = await prisma.skill.updateMany({
            where: { ecoId: Number(id) },
            data: {
                name
            }
        });
        const relatedProjectEcosystems = await prisma.projectEcosystem.updateMany({
            where: { ecoId: Number(id) },
            data: {
                name
            }
        });
        res.json({ 
            message: `Ecosystem updated. ${relatedSkills.count} related skill${
                relatedSkills.count !== 1 ? 's' : ''} and ${relatedProjectEcosystems.count} related projects${
                relatedProjectEcosystems.count !== 1 ? 's' : ''} updated.`,
            ecosystem: updatedEcosystem 
        });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Ecosystem with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Ecosystem already exists" });
        }
        next(err);
    }
}

//@desc Delete an ecosystem
//@route DELETE /tech/ecosystems
//@access Private
const deleteEcosystem = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Ecosystem ID Required'});
    }

    const relatedProjects = await prisma.projectEcosystem.findMany({
        where: {
            ecoId: Number(id) 
        },
        select: {
            project: {
            select: { name: true }
            }
        }
    });

    if (relatedProjects.length > 0) {
        const projectTitles = projectsUsingEcosystem.map(p => p.name).join('\n');
        return res.status(400).json({
            message: `Cannot delete ecosystem. These projects use it:\n${projectTitles}\nPlease remove the ecosystem from these projects and try again.`
        });
    }

    try {
        await prisma.ecosystem.delete({ where: { id } });
        res.json({ message: 'ecosystem deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        next(err);
    }
}

export default {
    getAllEcosystems,
    getEcosystemById,
    addEcosystem, 
    updateEcosystem,
    deleteEcosystem
}