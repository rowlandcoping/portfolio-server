import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ECOSYSTEM TYPES ROUTES

//@desc Get all ecosystem types
//@route GET /tech/ecotypes
//@access Private

const getAllEcoTypes =async (req, res) => {
    const ecoTypes = await prisma.ecoType.findMany();
    if (!ecoTypes.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No ecoTypes found'})
    }
    res.json(ecoTypes);
}

//@desc Create new ecosystem type
//@route POST /tech/ecotypes
//@access Private
const addEcoType = async (req, res) => {
    const { name } = req.body;
    //NB validate before making db query
    if (!name) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newEcoType = await prisma.ecoType.create({
            data: {
                name
            }
        });
        res.status(201).json(newEcoType);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Type of ecosystem already exists' });
        }
    }
};

//@desc Update an ecosystem type
//@route PATCH /tech/ecotypes
//@access Private
const updateEcoType = async (req, res) => { 
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const updatedEcoType = await prisma.ecoType.update({
            where: { id },
            data: {
                name
            }
        });
        res.json({ message: "Ecosystem type updated", name: updatedEcoType });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: `Ecosystem type with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Ecosystem type already exists" });
        }
    }
}

//@desc Delete an ecosystem type
//@route DELETE /tech/ecotypes
//@access Private
const deleteEcoType = async (req, res) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Tech type ID Required'});
    }

    const ecosystemsUsingEcoType = await prisma.ecosystem.findMany({
        where: { typeId: id },
        select: { name: true }
    });

    if (ecosystemsUsingEcoType.length > 0) {
            const ecosystems = ecosystemsUsingEcoType.map(p => p.name).join('\n');
            return res.status(400).json({
                message: `Cannot delete tech type. These technologies use it: ${ecosystems} \n  Please update their tech type and try again.`
            });
    }

    await prisma.ecoType.delete({ where: { id } });
    res.json({ message: 'tech type deleted successfully' });
}

export default {
    getAllEcoTypes,
    addEcoType, 
    updateEcoType,
    deleteEcoType
}