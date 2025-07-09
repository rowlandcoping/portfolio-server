import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PROJECT ECOSYSTEM ROUTES

//@desc Get all projectEcosystems
//@route GET /personal/projectEcosystems
//@access Private

const getAllProjectEcosystems =async (req, res) => {
    const projectEcosystems = await prisma.projectEcosystem.findMany();
    if (!projectEcosystems.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No projectEcosystems found'})
    }
    res.json(projectEcosystems);
}

//@desc Get projectEcosystems by ID
//@route GET /personal/projectEcosystems/:id
//@access Private

const getProjectEcosystemById =async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project Ecosystem ID required' });

    const projEcosystem = await prisma.projectEcosystem.findUnique({ 
        where: { id: Number(id) },
        include: { tech: true }
    });
    if (!projEcosystem) return res.status(404).json({ message: 'Project Ecosystem not found' });
    res.json(projEcosystem);
}

//@desc Get a skill
//@route GET /projects/projectecosystems/projects/:id
//@access Private
const getProjectEcosystemByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });

    const projEcosystems = await prisma.projectEcosystem.findMany({ where: { projectId: Number(id) } });
    if (!projEcosystems) return res.status(404).json({ message: 'No project ecosystems found' });
    res.json(projEcosystems);
}

//@desc Create new skill
//@route POST /projects/projectecosystems
//@access Private
const addProjectEcosystem = async (req, res, next) => {
    const { name, ecosystem, tech, project } = req.body;
    if (!name || !ecosystem || !project) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        //set data outside of db call
        const data = {
            name,           
            ecosystem: { connect: { id: Number(ecosystem) } },
            project: { connect: { id: Number(project) } },
        }
        if (tech) {
            data.tech = { connect: tech.map((tech) => ({ id: Number(tech) })) }
        }
        const newEntry = await prisma.projectEcosystem.create({ data });
        res.status(201).json({ message: "New Project Ecosystem Created", projEcosystem: newEntry });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'This Project Ecosystem already exists.' });
        }
        next(err);
    }
};

//@desc Update Project Ecosystem
//@route PATCH /projects/projectecosystems
//@access Private
const updateProjectEcosystem = async (req, res, next) => {

    const { id, name, ecosystem, tech  } = req.body;    
    //NB validate before making db query
    if (!id || !ecosystem || !name) {
        return res.status(400).json({ message: "Missing required fields" });
    }    
    const data = {
        ecosystem: { connect: { id: Number(ecosystem) } },
        name
    }
    if (tech) {
        data.tech = { connect: tech.map((tech) => ({ id: Number(tech) })) }
    }

    try {
        const updatedProjecosystem = await prisma.projectEcosystem.update({
            where: { id: Number(id) },
            data 
        });
        res.json({ message: "Project Ecosystem updated", projEcosystem: updatedProjecosystem });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'Project Ecosystem already exists' });
        }
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Project Ecosystem with id ${id} not found` });
        }
        next(err);
    }
};

//@desc Delete a skill
//@route DELETE /projects/projectEcosystems
//@access Private
const deleteProjectEcosystem = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Project Ecosystems ID required' });
    try {
        await prisma.projectEcosystem.delete({ where: { id: Number(id) } });
        res.json({ message: `Project Ecosystem with id ${id} deleted.` });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Project Ecosystem with id ${id} not found` });
        }
        next(err);
    }
};

export default {
    getAllProjectEcosystems,
    getProjectEcosystemById,
    getProjectEcosystemByProjectId,
    addProjectEcosystem, 
    updateProjectEcosystem,
    deleteProjectEcosystem
}