import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//TECH TYPES ROUTES

//@desc Get all tech types
//@route GET /tech/techtypes
//@access Private
const getAllTechTypes =async (req, res) => {
    const result = await query('SELECT * FROM "TechType"');
    const techTypes = result.rows;  
    if (!techTypes.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No techTypes found'})
    }
    res.json(techTypes);
}

//@desc Get a tech type
//@route GET /techTypes/techtypes/:id
//@access Private
const getTechTypeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech type ID required' });
    const result = await query('SELECT * FROM "TechType" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const techType = result.rows[0];
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
        const result = await query(
            `SELECT * FROM "TechType" WHERE "name" ILIKE $1 LIMIT 1`,
            [name]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Tech Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `INSERT INTO "TechType" ("name") VALUES ($1) RETURNING *`, [name]
        );
        const newTechType = result.rows[0]
        res.status(201).json(newTechType);
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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
        const result = await query(
            `SELECT * FROM "TechType" WHERE "name" ILIKE $1 AND "id" <> $2 LIMIT 1`,
            [name, Number(id)]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Tech Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `UPDATE "TechType" SET "name"=$1 WHERE "id"=$2 RETURNING *`,
                [name, Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Tech type with id ${id} not found` });
        } 
        const updatedTechType = result.rows[0];
        res.json({ message: "Tech type updated", name: updatedTechType });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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

    const result = await query('SELECT "name" FROM "Tech" WHERE "typeId"=$1 LIMIT 1', [Number(id)]);
    const techsUsingTechType = result.rows;

    if (techsUsingTechType.length > 0) {
        const techs = techsUsingTechType.map(p => p.name).join('\n');
        return res.status(400).json({
            message: `Cannot delete tech type. These technologies use it: ${techs} \n  Please update their tech type and try again.`
        });
    }

    try {
        const result = await query(
            `DELETE FROM "TechType" WHERE "id" = $1`,
            [Number(id)]
        );        
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Tech Type with id ${id} not found` });
        }
        res.json({ message: 'Tech type deleted successfully' });
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