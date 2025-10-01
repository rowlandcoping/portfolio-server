
import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ECOSYSTEM ROUTES

//@desc Get all ecosystems
//@route GET /tech/ecosystems
//@access Private

const getAllEcosystems =async (req, res) => {

    const result = await query('SELECT * FROM "Ecosystem"');
    const ecosystems = result.rows;

    if (!ecosystems.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No ecosystems found'})
    }
    res.json(ecosystems);
}

//@desc Get an ecosystem
//@route GET /tech/ecosystems/:id
//@access Private
const getEcosystemById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Ecosystem ID required' });

    const result = await query('SELECT * FROM "Ecosystem" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const ecosystem = result.rows[0];

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
        const result = await query(
            `SELECT * FROM "Ecosystem" WHERE "name" ILIKE $1 LIMIT 1`,
            [name]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Ecosystem already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `INSERT INTO "Ecosystem" ("name", "typeId") VALUES ($1, $2) RETURNING *`, [name.toLowerCase(), Number(type)]
        );
        const newEcosystem = result.rows[0]        
        res.status(201).json(newEcosystem);
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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
        const result = await query(
            `SELECT * FROM "Ecosystem" WHERE "name" ILIKE $1 AND "id" <> $2 LIMIT 1`,
            [name, Number(id)]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Ecosystem already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const result = await query(
            `UPDATE "Ecosystem" SET "name"=$1, "typeId"=$2 WHERE "id"=$3 RETURNING *`,
                [name.toLowerCase(), Number(type), Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Ecosystem with id ${id} not found` });
        }
        const updatedEcosystem=result.rows[0];

        res.json({ 
            message: 'Ecosystem updated.',
            ecosystem: updatedEcosystem
        });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
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

    const result = await query('SELECT * FROM "ProjectEcosystem" WHERE "ecoId"=$1 LIMIT 1', [Number(id)]);
    const related = result.rows;


    if (related.length > 0) {
        return res.status(400).json({
            message: `Cannot delete ecosystem because it is already in use.`
        });
    }

    try {
        const result = await query(
            `DELETE FROM "Ecosystem" WHERE "id" = $1`,
            [Number(id)]
        );
                
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Ecosystem with id ${id} not found` });
        }

        res.json({ message: 'Ecosystem deleted successfully' });
    } catch (err) {
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