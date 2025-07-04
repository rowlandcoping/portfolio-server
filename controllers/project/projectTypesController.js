import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//FEATUES ROUTES

//@desc Get all project types
//@route GET /projects/types
//@access Private

const getAllTypes =async (req, res) => {
    const types = await prisma.projectType.findMany();
    if (!types.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No types found'})
    }
    res.json(types);
}

//@desc Get a project type
//@route GET /projects/types/:id
//@access Private
const getProjectTypeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project Type ID required' });

    const type = await prisma.projectType.findUnique({ where: { id: Number(id) } });
    if (!type) return res.status(404).json({ message: 'No Project Type found' });

    res.json(type);
}

//@desc Create new project type
//@route POST /projects/types
//@access Private
const addType = async (req, res, next) => {
    const { name } = req.body;
    //NB validate before making db query
    if (!name) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newType = await prisma.projectType.create({
            data: {
                name
            }
        });
        res.status(201).json(newType);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Project Type already exists' });
        }
        next(err);
    }
};

//@desc Update a project type
//@route PATCH /projects/types
//@access Private
const updateType = async (req, res, next) => { 
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const updatedType = await prisma.projectType.update({
            where: { id: Number(id) },
            data: {
                name
            }
        });
        res.json({ message: "Project Type updated", name: updatedType });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Project Type with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Project Type already exists" });
        }
        next(err);
    }
}

//@desc Delete a project type
//@route DELETE /projects/types
//@access Private
const deleteType = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Project Type ID Required'});
    }

    const projectsUsingType = await prisma.project.findMany({
        where: { typeId: id },
        select: { title: true }
    });

    if (projectsUsingType.length > 0) {
            const projectTitles = projectsUsingType.map(p => p.title).join('\n');
            return res.status(400).json({
                message: `Cannot delete project type. These projects use it: ${projectTitles} \n  Please update their project type and try again.`
            });
    }

    try {
        await prisma.projectType.delete({ where: { id } });
        res.json({ message: 'Project type deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        next(err);
    }
}



export default {
    getAllTypes,
    getProjectTypeById,
    addType, 
    updateType,
    deleteType
}