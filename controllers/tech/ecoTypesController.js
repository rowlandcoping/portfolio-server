import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ECOSYSTEM TYPES ROUTES

//@desc Get all ecosystem types
//@route GET /tech/ecotypes 
//@access Private

const getAllEcoTypes =async (req, res) => {
    const result = await query('SELECT * FROM "EcoType"');
    const ecoTypes = result.rows;    
    if (!ecoTypes.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No ecoTypes found'})
    }
    res.json(ecoTypes);
}

//@desc Get an ecosystem type
//@route GET /ecoTypes/ecotypes/:id
//@access Private
const getEcoTypeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Ecosytem type ID required' });
    const result = await query('SELECT * FROM "EcoType" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const ecoType = result.rows[0];
    if (!ecoType) return res.status(404).json({ message: 'No Ecosytem type found' });
    res.json(ecoType);
}

//@desc Create new ecosystem type
//@route POST /tech/ecotypes
//@access Private
const addEcoType = async (req, res, next) => {
    const { name } = req.body;
    //NB validate before making db query
    if (!name) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const result = await query(
            `SELECT * FROM "EcoType" WHERE "name" ILIKE $1 LIMIT 1`,
            [name]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Ecosystem Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `INSERT INTO "EcoType" ("name") VALUES ($1) RETURNING *`, [name]
        );
        const newEcoType = result.rows[0]
        res.status(201).json(newEcoType);
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Type of ecosystem already exists' });
        }
        next(err);
    }
};

//@desc Update an ecosystem type
//@route PATCH /tech/ecotypes
//@access Private
const updateEcoType = async (req, res, next) => { 
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const result = await query(
            `SELECT * FROM "EcoType" WHERE "name" ILIKE $1 AND "id" <> $2 LIMIT 1`,
            [name, Number(id)]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Ecosystem Type already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    
    try {
        const result = await query(
            `UPDATE "EcoType" SET "name"=$1 WHERE "id"=$2 RETURNING *`,
                [name, Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Ecosystem type with id ${id} not found` });
        }
        const updatedEcoType=result.rows[0];
        res.json({ message: "Ecosystem type updated", ecoType: updatedEcoType });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: "Ecosystem type already exists" });
        }
        next(err);
    }
}

//@desc Delete an ecosystem type
//@route DELETE /tech/ecotypes
//@access Private
const deleteEcoType = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Ecosystem type ID Required'});
    }

    const result = await query('SELECT "name" FROM "Ecosystem" WHERE "typeId"=$1 LIMIT 1', [Number(id)]);
    const ecosystemsUsingEcoType = result.rows;

    if (ecosystemsUsingEcoType.length > 0) {
        const ecosystems = ecosystemsUsingEcoType.map(p => p.name).join('\n');
        return res.status(400).json({
            message: `Cannot delete ecosystem type. These ecosystems use it: ${ecosystems} \n  Please update their tech type and try again.`
        });
    }

    try {
        const result = await query( 
            `DELETE FROM "EcoType" WHERE "id" = $1`,
            [Number(id)]
        );        
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Ecosystem Type with id ${id} not found` });
        }
        res.json({ message: 'Ecosystem type deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export default {
    getAllEcoTypes,
    getEcoTypeById,
    addEcoType, 
    updateEcoType,
    deleteEcoType
}