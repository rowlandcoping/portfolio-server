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

//@desc Create new ecosystem
//@route POST /tech/ecosystems
//@access Private
const addEcosystem = async (req, res) => {
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
    }
};

//@desc Update an ecosystem type
//@route PATCH /tech/ecosystems
//@access Private
const updateEcosystem = async (req, res) => { 
    const { id, name, type } = req.body;

    if (!id || !name || !type) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const updatedEcosystem = await prisma.ecosystem.update({
            where: { id },
            data: {
                name,
                type: { connect: { id: Number(type) } },
            }
        });
        res.json({ message: "Ecosystem updated", ecosystem: updatedEcosystem });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: `Ecosystem with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Ecosystem already exists" });
        }
    }
}

//@desc Delete an ecosystem
//@route DELETE /tech/ecosystems
//@access Private
const deleteEcosystem = async (req, res) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Ecosystem ID Required'});
    }

    const projectsUsingEcosystem = await prisma.project.findMany({
        where: { ecoId: id },
        select: { title: true }
    });
    if (projectsUsingEcosystem.length > 0) {
            const projectTitles = projectsUsingEcosystem.map(p => p.title).join('\n');
            return res.status(400).json({
                message: `Cannot delete ecosystem. These projects use it: ${projectTitles} \n  Please remove the ecosystem from the projects and try again.`
            });
    }

    const techUsingEcosystem = await prisma.tech.findMany({
        where: { ecoId: id },
        select: { name: true }
    });
    if (techUsingEcosystem.length > 0) {
            const techNames = techUsingEcosystem.map(p => p.name).join('\n');
            return res.status(400).json({
                message: `Cannot delete ecosystem. These technologies use it: ${techNames} \n  Please remove the ecosystem from the technologies and try again.`
            });
    }

    await prisma.ecosystem.delete({ where: { id } });
    res.json({ message: 'ecosystem deleted successfully' });
}

export default {
    getAllEcosystems,
    addEcosystem, 
    updateEcosystem,
    deleteEcosystem
}