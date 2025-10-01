import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//FEATUES ROUTES

//@desc Get all project types
//@route GET /projects/types
//@access Private

const getAllTypes =async (req, res) => {

    const result = await query('SELECT * FROM "ProjectType"');
    const types = result.rows;
    if (!types.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No types found'})
    }
    res.json(types);
}

//@desc Get a project type
//@route GET /projects/types/:id
//@access Private
const getProjectTypeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project Type ID required' });
    const result = await query('SELECT * FROM "ProjectType" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const type = result.rows[0];
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
        const result = await query(
            `SELECT * FROM "ProjectType" WHERE "name" ILIKE $1 LIMIT 1`,
            [name]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Project Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `INSERT INTO "ProjectType" ("name") VALUES ($1) RETURNING *`, [name]
        );
        const newType = result.rows[0]
        res.status(201).json(newType);
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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
        const result = await query(
            `SELECT * FROM "ProjectType" WHERE "name" ILIKE $1 AND "id" <> $2 LIMIT 1`,
            [name, Number(id)]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Project Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {

        const result = await query(
            `UPDATE "ProjectType" SET "name"=$1 WHERE "id"=$2 RETURNING *`,
                [name, Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Project type with id ${id} not found` });
        }
        const updatedType = result.rows[0];
        res.json({ message: "Project Type updated", projectType: updatedType });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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
    
    const result = await query('SELECT "name" FROM "Project" WHERE "typeId"=$1', [Number(id)]);
    const projectsUsingType = result.rows;

    if (projectsUsingType.length > 0) {
        const projectTitles = projectsUsingType.map(p => p.name).join('\n');
        return res.status(400).json({
            message: `Cannot delete project type. These projects use it: ${projectTitles} \n  Please update their project type and try again.`
        });
    }
    try {
        const result = await query(
            `DELETE FROM "ProjectType" WHERE "id" = $1`,
            [Number(id)]
        );        
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Project Type with id ${id} not found` });
        }
        res.json({ message: 'Project type deleted successfully' });
    } catch (err) {
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