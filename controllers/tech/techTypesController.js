import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//TECH TYPES ROUTES

//@desc Get all tech types
//@route GET /tech/techtypes
//@access Private

const getAllTechTypes =async (req, res) => {
    const techTypes = await prisma.techType.findMany();
    if (!techTypes.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No techTypes found'})
    }
    res.json(techTypes);
}

//@desc Get a tech type
//@route GET /techTypes/techtypes/:id
//@access Private
const getTechTypeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech type ID required' });

    const techType = await prisma.techType.findUnique({ where: { id: Number(id) } });
    if (!techType) return res.status(404).json({ message: 'No tech type found' });

    res.json(techType);
}

//@desc Create new tech type
//@route POST /tech/techtypes
//@access Private
const addTechType = async (req, res, next) => {
    const { name } = req.body;
    //NB validate before making db query
    if (!name) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newTechType = await prisma.techType.create({
            data: {
                name
            }
        });
        res.status(201).json(newTechType);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Type of tech already exists' });
        }
        next(err);
    }
};

//@desc Update a tech type
//@route PATCH /tech/techtypes
//@access Private
const updateTechType = async (req, res, next) => { 
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const updatedTechType = await prisma.techType.update({
            where: { id },
            data: {
                name
            }
        });
        res.json({ message: "Tech type updated", name: updatedTechType });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Tech type with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Tech type already exists" });
        }
        next(err);
    }
}

//@desc Delete a tech type
//@route DELETE /tech/techtypes
//@access Private
const deleteTechType = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Tech type ID Required'});
    }

    const techsUsingTechType = await prisma.tech.findMany({
        where: { typeId: id },
        select: { name: true }
    });

    if (techsUsingTechType.length > 0) {
            const techs = techsUsingTechType.map(p => p.name).join('\n');
            return res.status(400).json({
                message: `Cannot delete tech type. These technologies use it: ${techs} \n  Please update their tech type and try again.`
            });
    }

    try {
        await prisma.techType.delete({ where: { id } });
        res.json({ message: 'tech type deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        next(err);
    }
}

export default {
    getAllTechTypes,
    getTechTypeById,
    addTechType, 
    updateTechType,
    deleteTechType
}